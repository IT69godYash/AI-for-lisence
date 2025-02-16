import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function DocumentUploader({ onUploadComplete }: { onUploadComplete: (text: string) => void }) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const text = await file.text();
      onUploadComplete(text);
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "text/*": [".txt", ".md", ".doc", ".docx"],
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragActive ? "border-primary bg-muted" : "border-muted-foreground"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            {isDragActive
              ? "Drop your document here"
              : "Drag and drop your document here, or click to select"}
          </p>
          <Button variant="secondary" className="mt-4">
            Select Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}