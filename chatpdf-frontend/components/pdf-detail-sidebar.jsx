import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function PdfDetailSidebar({selectedPdf, show, setShow }) {
  return (
    <Sheet open={show} onOpenChange={setShow}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Title: {selectedPdf?.title}</SheetTitle>
          <SheetDescription>
            Description: {selectedPdf?.description}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default PdfDetailSidebar;
