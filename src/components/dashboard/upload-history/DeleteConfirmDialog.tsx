
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedCount} selected report{selectedCount !== 1 ? 's' : ''}? 
            This will remove all associated test results and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-blue-200 hover:bg-blue-50"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
