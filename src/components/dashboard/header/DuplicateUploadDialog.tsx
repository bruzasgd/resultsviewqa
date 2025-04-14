
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DuplicateUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DuplicateUploadDialog = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
}: DuplicateUploadDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-blue-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800">Duplicate Report Detected</AlertDialogTitle>
          <AlertDialogDescription>
            This report appears to have been uploaded before. Do you want to upload it again?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} className="border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
            Upload Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
