import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "@/components/document-uploader";
import { TextInput } from "@/components/text-input";
import { AnalysisResult } from "@/components/analysis-result";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleLogout = () => {
    setLocation("/auth");
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Mock analysis for frontend demo
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  const handleTextInput = (text: string) => {
    setDocumentText(text);
    setShowAnalysis(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Copyright AI</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
              <DocumentUploader onUploadComplete={handleTextInput} />
            </div>
            <div>
              <TextInput onSubmit={handleTextInput} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Analysis</h2>
            {documentText ? (
              <>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Document Content</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {documentText.slice(0, 200)}...
                      </p>
                    </div>
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Document"}
                    </Button>
                  </CardContent>
                </Card>
                <AnalysisResult isVisible={showAnalysis} />
              </>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                Upload a document or enter text to see analysis results
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}