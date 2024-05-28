import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(4, {
    message: "Description must be at least 4 characters.",
  }),
  pdf: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
});

function AddProjectModal({ show, setShow, refetch }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const pdfRef = form.register("pdf");

  const { mutate:addCoupon } = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(`http://localhost:4001/api/project/add`, values)
      return res.data;
    },
    onError: (error) => {
      if(error.response) {
        return toast({
          variant: "destructive",
          title: error.response.data.message
        })
      }
    },
    onSuccess: (data) => {
      if(data.success) {
        // reset the form 
        form.reset()
        refetch()
        setShow(false)
        return toast({
          title: `project successfully created`
        })
      }
    }
  })


  async function onSubmit(values) {

    const formData = new FormData()

    // appending all the fields exept pdf
    for (const key in values) {
        const element = values[key];
        if(key !== "pdf") {
            formData.append(key, element)
        }
    }

    // appending the pdf file
    formData.append("pdf", Object.values(values.pdf)[0])

    addCoupon(formData)

  }

  const handleModalClose = () => {
    // reset the form
    form.reset()
    setShow(false)
  }

  return (
    <Dialog open={show} onOpenChange={handleModalClose}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8  pl-1.5 pr-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your description here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* pdf start */}
            <div>
              <FormField
                control={form.control}
                name="pdf"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Pdf</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select your pdf"
                        type="file"
                        accept=".pdf"
                        multiple={false}
                        {...pdfRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* pdf end */}

            <div className="flex items-center justify-between">
                <Button type="button" variant="outline" onClick={handleModalClose}>
                  Close
                </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProjectModal;
