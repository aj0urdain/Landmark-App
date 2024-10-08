import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const LibraryPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Library</CardTitle>
        <CardDescription>
          The layout of this page is still under development!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {/* Premium IM PDF, Premium IM Submission, Premium IM Working Folder (IM + SUBMISSION), Market Share */}
        <h2>Premium Content</h2>

        {/* Portfolio Magazine Library */}
        <h2>Portfolio Magazine Library</h2>

        {/* Industry Reports */}
        <h2>Industry Reports</h2>

        {/* Industry Snapshots */}
        <h2>Industry Snapshots</h2>

        {/* Auction Results */}
        <h2>Auction Results</h2>

        {/* Capability Statement */}
        <h2>Capability Statement</h2>

        {/* IM/Submission */}
        <h2>IM/Submission</h2>

        {/* Icon Library (needs to be maintainable pngs) */}
        <h2>Icon Library</h2>

        {/* Fonts */}
        <h2>Fonts</h2>

        {/* Colors */}
        <h2>Colors</h2>

        {/* Typography */}
        <h2>Typography</h2>

        {/* Icons */}
        <h2>Icons</h2>

        {/* Images */}
        <h2>Images</h2>

        {/* Videos */}
        <h2>Videos</h2>

        {/* Audio */}
        <h2>Audio</h2>

        {/* Documents */}
        <h2>Documents</h2>

        {/* Spreadsheets */}
        <h2>Spreadsheets</h2>

        {/* Presentations */}
        <h2>Presentations</h2>

        {/* Databases */}
        <h2>Databases</h2>
      </CardContent>
    </Card>
  );
};

export default LibraryPage;
