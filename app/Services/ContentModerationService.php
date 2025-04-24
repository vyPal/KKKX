<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContentModerationService
{
    /**
     * Analyze content for racist elements using AI
     */
    public function analyzeContent($content)
    {
        // Option 1: Use OpenAI or similar API for content analysis
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/moderations', [
                'input' => $content
            ]);

            if ($response->successful()) {
                $result = $response->json();

                // Extract hate score from OpenAI response
                $hateScore = $result['results'][0]['category_scores']['hate'] ?? 0;

                return $hateScore;
            } else {
                return $this->basicContentAnalysis($content);
            }
        } catch (\Exception $e) {
            return $this->basicContentAnalysis($content);
        }
    }

    /**
     * Very basic fallback analysis using keywords
     */
    protected function basicContentAnalysis($content)
    {
        $content = strtolower($content);
        $racistTerms = config('moderation.racist_terms', []);

        $matchedTerms = [];
        $score = 0;
        foreach ($racistTerms as $term => $weight) {
            if (str_contains($content, $term)) {
                $score += $weight;
                $matchedTerms[] = $term;
            }
        }

        $finalScore = min($score, 1); // Cap at 1.0

        return $finalScore;
    }

    /**
     * Recalculate score based on user reports
     */
    public function recalculateScore(Post $post)
    {
        $racismReports = $post->reports()->where('is_racism_report', true)->count();
        $totalReports = $post->reports()->count();

        if ($totalReports > 0) {
            // Calculate the percentage of racism reports
            $reportScore = $racismReports / $totalReports;

            // Weight the AI score and user reports
            $currentScore = $post->racism_score;
            $newScore = ($currentScore * 0.7) + ($reportScore * 0.3);

            // Update post score and visibility
            $post->update([
                'racism_score' => $newScore,
                'is_hidden' => $newScore < config('moderation.critical_threshold')
            ]);
        }
    }
}
