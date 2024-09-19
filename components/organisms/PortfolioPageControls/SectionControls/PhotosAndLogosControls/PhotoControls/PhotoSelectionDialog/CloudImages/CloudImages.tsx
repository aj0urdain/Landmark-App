import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CloudImagesProps {
  onPhotoSelect: (photo: string) => void;
}

const CloudImages: React.FC<CloudImagesProps> = ({ onPhotoSelect }) => {
  const { data: cloudImages } = useQuery({
    queryKey: ["cloudImages"],
    queryFn: () => [
      "https://i.imgur.com/4TzAucg.jpeg",
      "https://i.imgur.com/AXLr28A.jpeg",
      // ... more photos
    ],
  });

  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Filename</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cloudImages?.map((photo, index) => (
            <TableRow key={index}>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger>
                    <Image
                      src={photo}
                      alt={`PropertyBase photo ${index + 1}`}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <Image
                      src={photo}
                      alt={`PropertyBase photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded"
                    />
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>Image {index + 1}</TableCell>
              <TableCell>
                <Button onClick={() => onPhotoSelect(photo)}>Select</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CloudImages;
