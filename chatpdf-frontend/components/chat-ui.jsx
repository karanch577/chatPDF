'use client'

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Info, SendHorizontal } from "lucide-react";
import ChatCard from "./chat-card";
import useSelectedPdf from "@/store/useSelectedPdf";
import { Badge } from "./ui/badge";
import PdfDetailSidebar from "./pdf-detail-sidebar";

const formSchema = z.object({
  query: z.string().min(2, {
    message: "Query must be at least 2 characters.",
  }),
});

function ChatUI() {
  const { selectedPdf, addSelectedPdf } = useSelectedPdf();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTypingEffect, setShowTypingEffect] = useState(false);
  const [isChatAllowed, setIsChatAllowed] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  // fetching the status of the embedding on regular interval if the status is pending

  const { data, isSuccess } = useQuery({
    queryKey: [selectedPdf.id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:4001/api/project/detail?id=${selectedPdf.id}`
      );

      return res.data;
    },
    refetchInterval: isChatAllowed ? false : 3000
  });


  // updating the chatHistory when toggling between projects

  useEffect(() => {
    if(isSuccess) {
      setChatHistory(
        data?.project?.chat_history ? data.project.chat_history : []
      );
      setShowTypingEffect(false);

      addSelectedPdf(data.project)
      if(data?.project?.embedding_status === "created") {
        setIsChatAllowed(true)
      }
    }
  }, [selectedPdf?.id, data?.project]);

  const { mutate: handleQuery, isPending } = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(`http://localhost:4001/api/chat`, {
        query: values.query,
        id: selectedPdf.id,
        chatHistory,
      });
      return res.data;
    },
    onError: (error) => {
      console.log(error)
      
      const updatedHistory = chatHistory.map((item, i) => {
        if (i === chatHistory.length - 1) {
          return {
            role: "model",
            parts: [{ text: "failed" }],
          };
        }

        return item;
      });

      setChatHistory(updatedHistory);
      setShowTypingEffect(true);
    },
    onSuccess: (data) => {
      const updatedHistory = chatHistory.map((item, i) => {
        if (i === chatHistory.length - 1) {
          return {
            role: "model",
            parts: [{ text: data?.answer }],
          };
        }

        return item;
      });

      setChatHistory(updatedHistory);
      setShowTypingEffect(true);
    },
  });
  const onSubmit = (values) => {
    // reset the form
    form.reset();

    // add the user prompt to chat history
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        parts: [{ text: values?.query }],
      },
      {
        role: "model",
        parts: [{ text: "" }],
      },
    ]);
    handleQuery(values);
  };
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 w-full">
      <div className="w-full h-[90%]">
        <div className="mb-2">
          <p className="font-semibold line-clamp-2">{selectedPdf?.title}</p>
          <div className="flex justify-between">
            <div className="my-1">
              <span>Status: </span>
              <Badge
                variant={`${
                  selectedPdf?.embedding_status === "failed"
                    ? "destructive"
                    : selectedPdf?.embedding_status === "pending"
                    ? "outline"
                    : "default"
                }`}
              >
                {selectedPdf?.embedding_status}
              </Badge>
            </div>

            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info onClick={() => setShowSidebar(true)} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>click to view detail</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <PdfDetailSidebar
            selectedPdf={selectedPdf}
            show={showSidebar}
            setShow={setShowSidebar}
          />

          {/* showing message in case of failed */}
          {selectedPdf?.embedding_status === "failed" && (
            <div className="text-red-500 my-3">
              You can't chat with this pdf! please try creating new project
            </div>
          )}

          {/* showing message in case of pending */}
          {selectedPdf?.embedding_status === "pending" && (
            <div className="my-3">
              You can't chat with this pdf! please wait...
            </div>
          )}
        </div>

        {chatHistory.map((item, i) => (
          <ChatCard
            key={i}
            isUser={item?.role === "user"}
            content={item?.parts[0]?.text}
            showTypingEffect={
              item?.role === "model" &&
              item?.parts[0]?.text !== "" &&
              i === chatHistory?.length - 1 &&
              showTypingEffect
            }
          />
        ))}
      </div>
      <div className="h-20 md:h-24 bg-white w-full fixed bottom-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex w-[82vw] md:w-[64vw] items-start gap-3 rounded-3 fixed bottom-[5vh]"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Ask your pdf"
                      disabled={!isChatAllowed}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" disabled={isPending}>
              <SendHorizontal />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatUI;
