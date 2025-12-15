"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useUser } from "@/context/UserContext";
import { GetFileName, UpdateCompleteNote } from "@/lib/db";
import { customToast } from "@/lib/utils";
import { NoteDoc } from "@/types/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import Dropzone from "./Dropzone";
import KeyIcon from "./categories/KeyIcon";
import { useIconsContext } from "@/context/IconsContext";
import useCtrlSomething from "@/hooks/useCtrlSomething";
import { AppConfig } from "@/lib/config";

const FormSchema = z.object({
  content: z.string().default(""),
  category: z.string().default(""),
});

type UpdateNoteModalProps = {
  Open: boolean;
  setOpen: (v: boolean) => void;
} & Omit<NoteDoc, "timestamp" | "isPublic">;

export default function UpdateNoteModal({
  content,
  files: prevFiles,
  id,
  categoryId,
  setOpen,
  Open,
}: UpdateNoteModalProps) {
  const [Files, setFiles] = useState<File[]>([]);
  const [RemovedFiles, setRemovedFiles] = useState<string[]>([]);
  const [Saving, setSaving] = useState<boolean>(false);
  const { Categories } = useCategoriesContext();
  const { findBy } = useIconsContext();
  const { isLoggedIn } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const SaveNote = async ({
    content,
    category,
  }: z.infer<typeof FormSchema>) => {
    if (
      content === "" &&
      Files.length === 0 &&
      RemovedFiles.length === 0 &&
      category === categoryId
    ) {
      toast(customToast("Nothing to update.", true));
      return;
    }
    const finalCategory =
      category === AppConfig.defaultFilters(true, true) ? "" : category;
    setSaving(true);
    UpdateCompleteNote(
      id,
      content,
      RemovedFiles,
      prevFiles,
      Files,
      isLoggedIn,
      finalCategory
    );
    toast(customToast("Note was updated."));
    setOpen(false);
    form.reset();
    setFiles([]);
    setRemovedFiles([]);
    setSaving(false);
  };

  const ToggleRemoveExistingFile = (url: string) => {
    if (RemovedFiles.includes(url)) {
      const newRemovedFiles = RemovedFiles.filter((file) => file !== url);
      setRemovedFiles(newRemovedFiles);
    } else {
      setRemovedFiles((files) => [...files, url]);
    }
  };

  useEffect(() => {
    form.setValue("content", content);
    form.setValue("category", categoryId);
  }, [content, categoryId]);

  useCtrlSomething(() => SaveNote(form.getValues()), "enter", Open);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update note</DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">Update note</DialogDescription>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(SaveNote)}
          className="flex items-center space-x-2"
        >
          <div className="grid w-full gap-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Your note..."
                      className="min-h-16 h-52 max-h-96"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={(e) => (e.target.selectionStart = content.length)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AppConfig.defaultFilters(true, true)}>
                        <div className="flex gap-3 items-center capitalize">
                          <div className="w-6"></div>
                          <span>{AppConfig.defaultFilters(false, true)}</span>
                        </div>
                      </SelectItem>
                      {Categories.map((category) => (
                        <SelectItem value={category.id} key={category.id}>
                          <div className="flex gap-3 items-center capitalize">
                            <KeyIcon
                              name={category.icon}
                              color={findBy(category.icon)?.color}
                            />
                            <span>{category.content}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div>
              <Dropzone Files={Files} setFiles={setFiles} />
              {prevFiles.length !== 0 && (
                <div className={Files.length === 0 ? "pt-3" : ""}>
                  <ExistingFilesList
                    files={prevFiles}
                    onFileClick={ToggleRemoveExistingFile}
                    RemovedFiles={RemovedFiles}
                  />
                </div>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={Saving}>
              {Saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save note
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

type ExistingFilesListProps = {
  files: string[];
  RemovedFiles: string[];
  onFileClick: (v: string) => void;
};

const ExistingFilesList = ({
  files,
  onFileClick,
  RemovedFiles,
}: ExistingFilesListProps) => (
  <div className="flex flex-col gap-1">
    {files.map((file) => (
      <Button
        type="button"
        variant="ghost"
        className={`flex flex-row justify-start items-center gap-2 ${
          RemovedFiles.includes(file) ? "opacity-40" : ""
        }`}
        key={file}
        onClick={() => onFileClick(file)}
        title={GetFileName(file)}
      >
        <span className="text-destructive min-w-[1.125rem]">
          <Trash size={18} />
        </span>
        <span className="text-xs text-start word-break line-clamp-1">
          {GetFileName(file)}
        </span>
      </Button>
    ))}
  </div>
);
