"use client"

import { Menu, FileText } from 'lucide-react'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Spinner from './spinner'
import useSelectedPdf from '@/store/useSelectedPdf'


function MobileNav({ isPending, data }) {
  const { selectedPdf, addSelectedPdf } = useSelectedPdf()
  const [isOpen, setIsOpen] = useState(false)

  const handleProjectSelect = (project) => {
    addSelectedPdf(project)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <h4
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <FileText className="h-6 w-6" />
                  <span>Your Projects</span>
                </h4>
                { isPending ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
            <Spinner />
          </div>
          ) : data && data.length > 0 ? 
          data.map(project => (
              <p key={project.id} className={`flex gap-3 items-center hover:bg-gray-100 p-2 cursor-pointer ${selectedPdf?.id === project.id ? "bg-gray-200" : "bg-white"}`} onClick={() => handleProjectSelect(project)}>
              <FileText />
                {project?.title}
              </p>
          )) : (
            <p className="text-center">No projects created</p>
          )}
              </nav>
              
            </SheetContent>
          </Sheet>
  )
}

export default MobileNav