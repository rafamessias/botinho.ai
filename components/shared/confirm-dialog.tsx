import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import { Button } from './button';

interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: 'primary' | 'secondary' | 'outline';
}

export function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    title = 'Confirmar ação',
    description = 'Tem certeza que deseja continuar?',
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    confirmVariant = 'primary',
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={open => !open && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 ">
                    <Button variant="outline" onClick={onCancel} type="button" className=" flex-1 py-2 px-4">{cancelLabel}</Button>
                    <Button variant={confirmVariant} onClick={onConfirm} type="button" className=" flex-1  py-2 px-4">{confirmLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 