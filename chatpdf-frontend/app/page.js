"use client"

import Link from "next/link"
import {
  FileText
} from "lucide-react"

import { Button } from "@/components/ui/button"


import AddProjectModal from "@/components/add-project-modal"
import { useState } from "react"
import MobileNav from "@/components/mobile-nav"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import useSelectedPdf from "@/store/useSelectedPdf"
import ChatUI from "@/components/chat-ui"
import Spinner from "@/components/spinner"


function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { selectedPdf, addSelectedPdf } = useSelectedPdf()


  const { isPending, data, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4001/api/project/list")

      return res.data.projects;
    }
  })

  return (
    <div className="grid min-h-screen w-full py-12">
      <div className="hidden md:block fixed top-0 border h-full left-0 w-[20vw] bg-gray-50">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <FileText className="h-6 w-6" />
              <span className="">Your Projects</span>
            </Link>
          </div>
          {/* desktop sidebar start */}
          <div className="flex-1">
            <div className="flex justify-center pt-3 mb-9">
              <Button onClick={() => setShowAddModal(true)}>Add Project</Button> 
            </div>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              { isPending ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
              ) : data && data.length > 0 ? (
                <div className="h-[80vh] overflow-y-auto">
                {data.map(project => (
                    <p key={project.id} className={`flex gap-3 items-center hover:bg-gray-100 p-2 cursor-pointer ${selectedPdf?.id === project.id ? "bg-gray-200" : "bg-white"}`} onClick={() => addSelectedPdf(project)}>
                    <FileText />
                      {project?.title}
                    </p>
                ))}
                </div>
                ) : (
                  <p className="text-center">No projects created</p>
                )
              }
            
            </nav>
          </div>
          {/* desktop sidebar end */}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 fixed top-0 md:ml-[20vw] w-full bg-white">
          <MobileNav isPending={isPending} data={data} />
          <div className="w-full flex-1 bg-white">
            <h4 className="text-lg font-semibold md:text-2xl">ChatPDF</h4>
          </div>
    
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 md:ml-[20vw] md:w-[78vw]">
          { isPending ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
            <Spinner />
          </div>
          ) : !selectedPdf ? (
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                {!isPending && data && data.length > 0 ? "Please select any pdf" : "You have no projects"}
              </h3>
              <p className="text-sm text-muted-foreground">
                You can create a project, upload your pdf and chat with it
              </p>
              <Button className="mt-4" onClick={() => setShowAddModal(true)}>Add Project</Button>
              
            </div>
          </div>
        ) : <ChatUI />}
        </main>
        <AddProjectModal show={showAddModal} setShow={setShowAddModal} refetch={refetch} />
      </div>
    </div>
  )
}

export default HomePage