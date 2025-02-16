import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  onSubmit: (text: string) => void;
}

export function TextInput({ onSubmit }: TextInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Or Enter Text Directly</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type or paste your text here..."
          className="min-h-[200px] mb-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button 
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full"
        >
          Submit Text
        </Button>
      </CardContent>
    </Card>
  );
}
