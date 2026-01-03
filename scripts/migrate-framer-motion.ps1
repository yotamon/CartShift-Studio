# Batch update remaining framer-motion imports to use @/lib/motion

$files = @(
  "components\layout\Header.tsx",
  "components\portal\ActivityTimeline.tsx",
  "components\portal\ClientAnalytics.tsx",
  "components\portal\MilestoneEditor.tsx",
  "components\portal\MilestoneTimeline.tsx",
  "components\portal\OnboardingTour.tsx",
  "components\portal\PortalShell.tsx",
  "components\portal\ScheduleConsultationForm.tsx",
  "components\portal\ui\MobileSearch.tsx",
  "components\portal\ui\Toast.tsx",
  "components\portal\ui\FormError.tsx",
  "components\portal\ui\FavoriteButton.tsx",
  "components\portal\ui\OfflineIndicator.tsx",
  "components\portal\onboarding\OnboardingStep.tsx",
  "components\portal\onboarding\OnboardingWizard.tsx",
  "components\portal\requests\CommentItem.tsx",
  "components\portal\integrations\ShopifyStoreIntegration.tsx",
  "components\portal\integrations\GoogleCalendarIntegration.tsx",
  "components\sections\AboutPageContent.tsx",
  "components\sections\BlogPageContent.tsx",
  "components\sections\BlogPostContent.tsx",
  "components\sections\BlogTeaser.tsx",
  "components\sections\CaseStudyContent.tsx",
  "components\sections\CaseStudyDetailContent.tsx",
  "components\sections\ClientPortalPageContent.tsx",
  "components\sections\ContactPageContent.tsx",
  "components\sections\CTABanner.tsx",
  "components\sections\HomepageIntro.tsx",
  "components\sections\IndustryPageContent.tsx",
  "components\sections\MaintenancePageContent.tsx",
  "components\sections\PageHero.tsx",
  "components\sections\PricingPageContent.tsx",
  "components\sections\Process.tsx",
  "components\sections\ProcessSection.tsx",
  "components\sections\ServicesOverview.tsx",
  "components\sections\ShopifyPageContent.tsx",
  "components\sections\Testimonials.tsx",
  "components\sections\WhyChoose.tsx",
  "components\sections\WordPressPageContent.tsx",
  "components\sections\WorkPageContent.tsx",
  "components\ui\CookieConsent.tsx",
  "components\ui\Dropdown.tsx",
  "components\ui\ExitIntentModal.tsx",
  "components\ui\FloatingActions.tsx",
  "components\ui\LanguageSwitcher.tsx",
  "components\ui\Section.tsx",
  "components\ui\ThemeToggle.tsx",
  "components\ui\TiltCard.tsx",
  "app\[locale]\portal\org\[orgId]\template.tsx",
  "app\[locale]\portal\org\[orgId]\consultations\ConsultationsClient.tsx",
  "app\[locale]\portal\org\[orgId]\requests\RequestsClient.tsx",
  "app\[locale]\portal\org\[orgId]\requests\[requestId]\RequestDetailClient.tsx",
  "app\[locale]\portal\agency\consultations\AgencyConsultationsClient.tsx"
)

$basePath = "c:\Users\yotam\Desktop\Personal Projects\CartShift Studio\"
$count = 0
$errors = @()

foreach ($file in $files) {
  $fullPath = Join-Path $basePath $file

  if (Test-Path $fullPath) {
    try {
      $content = Get-Content $fullPath -Raw

      # Replace framer-motion imports
      $newContent = $content -replace "from ['`"]framer-motion['`"]", 'from "@/lib/motion"'

      if ($content -ne $newContent) {
        Set-Content -Path $fullPath -Value $newContent -NoNewline
        $count++
        Write-Host "Updated: $file" -ForegroundColor Green
      } else {
        Write-Host "Skipped: $file" -ForegroundColor Yellow
      }
    } catch {
      $errors += $file
      Write-Host "Error: $file" -ForegroundColor Red
    }
  } else {
    Write-Host "Not found: $file" -ForegroundColor Magenta
  }
}

Write-Host "`nMigration Complete!" -ForegroundColor Cyan
Write-Host "Files updated: $count" -ForegroundColor Green
Write-Host "Errors: $($errors.Count)" -ForegroundColor $(if ($errors.Count -eq 0) { "Green" } else { "Red" })
