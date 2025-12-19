"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { logError } from "@/lib/logger";

interface LiquidGlassProps {
	children: React.ReactNode;
	className?: string;
	/**
	 * Image URL to use as the background for the glass effect.
	 * If not provided, the component will capture the background.
	 */
	backgroundImage?: string;
	/**
	 * Enable/disable the glass effect
	 */
	enabled?: boolean;
	/**
	 * Intensity of the blur effect (1-10)
	 */
	blurIntensity?: number;
	/**
	 * Intensity of the lens distortion (1-10)
	 */
	lensIntensity?: number;
}

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec4 iMouse;
  uniform sampler2D iChannel0;
  uniform float uBlurIntensity;
  uniform float uLensIntensity;

  void mainImage(out vec4 fragColor, in vec2 fragCoord)
  {
    // Constants
    const float NUM_ZERO = 0.0;
    const float NUM_ONE = 1.0;
    const float NUM_HALF = 0.5;
    const float NUM_TWO = 2.0;
    const float POWER_EXPONENT = 6.0;

    float MASK_MULTIPLIER_1 = 10000.0 * uLensIntensity;
    float MASK_MULTIPLIER_2 = 9500.0 * uLensIntensity;
    float MASK_MULTIPLIER_3 = 11000.0 * uLensIntensity;
    float LENS_MULTIPLIER = 5000.0 * uLensIntensity;

    const float MASK_STRENGTH_1 = 8.0;
    const float MASK_STRENGTH_2 = 16.0;
    const float MASK_STRENGTH_3 = 2.0;
    const float MASK_THRESHOLD_1 = 0.95;
    const float MASK_THRESHOLD_2 = 0.9;
    const float MASK_THRESHOLD_3 = 1.5;

    float SAMPLE_RANGE = 4.0 * uBlurIntensity;
    const float SAMPLE_OFFSET = 0.5;
    const float GRADIENT_RANGE = 0.2;
    const float GRADIENT_OFFSET = 0.1;
    const float GRADIENT_EXTREME = -1000.0;
    const float LIGHTING_INTENSITY = 0.3;

    vec2 uv = fragCoord / iResolution.xy;
    vec2 mouse = iMouse.xy;
    if (length(mouse) < NUM_ONE) {
      mouse = iResolution.xy / NUM_TWO;
    }
    vec2 m2 = (uv - mouse / iResolution.xy);

    float roundedBox = pow(abs(m2.x * iResolution.x / iResolution.y), POWER_EXPONENT) + pow(abs(m2.y), POWER_EXPONENT);
    float rb1 = clamp((NUM_ONE - roundedBox * MASK_MULTIPLIER_1) * MASK_STRENGTH_1, NUM_ZERO, NUM_ONE);
    float rb2 = clamp((MASK_THRESHOLD_1 - roundedBox * MASK_MULTIPLIER_2) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE) -
      clamp(pow(MASK_THRESHOLD_2 - roundedBox * MASK_MULTIPLIER_2, NUM_ONE) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE);
    float rb3 = clamp((MASK_THRESHOLD_3 - roundedBox * MASK_MULTIPLIER_3) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE) -
      clamp(pow(NUM_ONE - roundedBox * MASK_MULTIPLIER_3, NUM_ONE) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE);

    fragColor = vec4(NUM_ZERO);
    float transition = smoothstep(NUM_ZERO, NUM_ONE, rb1 + rb2);

    if (transition > NUM_ZERO) {
      vec2 lens = ((uv - NUM_HALF) * NUM_ONE * (NUM_ONE - roundedBox * LENS_MULTIPLIER) + NUM_HALF);
      float total = NUM_ZERO;
      for (float x = -4.0; x <= 4.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
          vec2 offset = vec2(x, y) * SAMPLE_OFFSET * uBlurIntensity / iResolution.xy;
          fragColor += texture2D(iChannel0, offset + lens);
          total += NUM_ONE;
        }
      }
      fragColor /= total;

      float gradient = clamp((clamp(m2.y, NUM_ZERO, GRADIENT_RANGE) + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE) +
        clamp((clamp(-m2.y, GRADIENT_EXTREME, GRADIENT_RANGE) * rb3 + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE);
      vec4 lighting = clamp(fragColor + vec4(rb1) * gradient + vec4(rb2) * LIGHTING_INTENSITY, NUM_ZERO, NUM_ONE);

      fragColor = mix(texture2D(iChannel0, uv), lighting, transition);
    } else {
      fragColor = texture2D(iChannel0, uv);
    }
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

export const LiquidGlass: React.FC<LiquidGlassProps> = ({ children, className = "", backgroundImage, enabled = true, blurIntensity = 1, lensIntensity = 1 }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const glRef = useRef<WebGLRenderingContext | null>(null);
	const programRef = useRef<WebGLProgram | null>(null);
	const textureRef = useRef<WebGLTexture | null>(null);
	const animationRef = useRef<number>(0);
	const mouseRef = useRef<[number, number]>([0, 0]);
	const startTimeRef = useRef<number>(performance.now());
	const uniformsRef = useRef<{
		resolution: WebGLUniformLocation | null;
		time: WebGLUniformLocation | null;
		mouse: WebGLUniformLocation | null;
		texture: WebGLUniformLocation | null;
		blurIntensity: WebGLUniformLocation | null;
		lensIntensity: WebGLUniformLocation | null;
	}>({
		resolution: null,
		time: null,
		mouse: null,
		texture: null,
		blurIntensity: null,
		lensIntensity: null
	});
	const [isReady, setIsReady] = useState(false);

	const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
		const shader = gl.createShader(type);
		if (!shader) return null;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			logError("Shader compile error", new Error(gl.getShaderInfoLog(shader) || "Unknown shader error"));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}, []);

	const setupTexture = useCallback((gl: WebGLRenderingContext, image: HTMLImageElement) => {
		if (textureRef.current) {
			gl.deleteTexture(textureRef.current);
		}

		const texture = gl.createTexture();
		textureRef.current = texture;

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}, []);

	const render = useCallback(() => {
		const gl = glRef.current;
		const canvas = canvasRef.current;
		const program = programRef.current;
		const uniforms = uniformsRef.current;
		const texture = textureRef.current;

		if (!gl || !canvas || !program || !texture) return;

		const currentTime = (performance.now() - startTimeRef.current) / 1000;

		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(program);

		if (uniforms.resolution) {
			gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, 1.0);
		}
		if (uniforms.time) {
			gl.uniform1f(uniforms.time, currentTime);
		}
		if (uniforms.mouse) {
			gl.uniform4f(uniforms.mouse, mouseRef.current[0], mouseRef.current[1], 0, 0);
		}
		if (uniforms.blurIntensity) {
			gl.uniform1f(uniforms.blurIntensity, blurIntensity);
		}
		if (uniforms.lensIntensity) {
			gl.uniform1f(uniforms.lensIntensity, lensIntensity);
		}

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		if (uniforms.texture) {
			gl.uniform1i(uniforms.texture, 0);
		}

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		animationRef.current = requestAnimationFrame(render);
	}, [blurIntensity, lensIntensity]);

	const initWebGL = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl", {
			alpha: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: true
		});

		if (!gl) {
			logError("WebGL not supported");
			return;
		}

		glRef.current = gl;

		// Create shaders
		const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
		const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

		if (!vs || !fs) return;

		// Create program
		const program = gl.createProgram();
		if (!program) return;

		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			logError("Program link error", new Error(gl.getProgramInfoLog(program) || "Unknown program error"));
			return;
		}

		programRef.current = program;
		gl.useProgram(program);

		// Setup buffer
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

		const position = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

		// Get uniform locations
		uniformsRef.current = {
			resolution: gl.getUniformLocation(program, "iResolution"),
			time: gl.getUniformLocation(program, "iTime"),
			mouse: gl.getUniformLocation(program, "iMouse"),
			texture: gl.getUniformLocation(program, "iChannel0"),
			blurIntensity: gl.getUniformLocation(program, "uBlurIntensity"),
			lensIntensity: gl.getUniformLocation(program, "uLensIntensity")
		};

		// Enable blending for transparency
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}, [createShader]);

	const loadImage = useCallback(
		(src: string) => {
			const gl = glRef.current;
			if (!gl) return;

			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				setupTexture(gl, img);
				setIsReady(true);
				render();
			};
			img.onerror = () => {
				logError("Failed to load image", new Error(`Failed to load: ${src}`));
			};
			img.src = src;
		},
		[setupTexture, render]
	);

	const setCanvasSize = useCallback(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const rect = container.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;
	}, []);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = rect.height - (e.clientY - rect.top);
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		mouseRef.current = [x * dpr, y * dpr];
	}, []);

	useEffect(() => {
		if (!enabled) return;

		initWebGL();
		setCanvasSize();

		if (backgroundImage) {
			loadImage(backgroundImage);
		}

		const handleResize = () => {
			setCanvasSize();
			if (backgroundImage) {
				loadImage(backgroundImage);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [enabled, backgroundImage, initWebGL, setCanvasSize, loadImage]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !enabled) return;

		canvas.addEventListener("mousemove", handleMouseMove);

		return () => {
			canvas.removeEventListener("mousemove", handleMouseMove);
		};
	}, [enabled, handleMouseMove]);

	if (!enabled) {
		return <div className={className}>{children}</div>;
	}

	return (
		<div ref={containerRef} className={`relative ${className}`}>
			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0" style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.3s ease" }} />
			<div className="relative z-10">{children}</div>
		</div>
	);
};

export default LiquidGlass;
