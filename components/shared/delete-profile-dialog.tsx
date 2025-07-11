import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import { Button } from './button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';

interface DeleteProfileDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    nameConfirmation?: string;
    namePlaceholder?: string;
    nameRequired?: string;
    nameMismatch?: string;
    expectedName: string;
}

export function DeleteProfileDialog({
    open,
    onConfirm,
    onCancel,
    title = 'Delete Profile',
    description = 'This action cannot be undone. This will permanently delete your profile and remove you from all projects and companies.',
    confirmLabel = 'Delete Profile',
    cancelLabel = 'Cancel',
    nameConfirmation = 'Please type your full name to confirm deletion',
    namePlaceholder = 'Enter your full name',
    nameRequired = 'Please enter your full name to confirm deletion',
    nameMismatch = 'Name does not match. Please enter your full name exactly as shown.',
    expectedName,
}: DeleteProfileDialogProps) {
    const [enteredName, setEnteredName] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!enteredName.trim()) {
            setError(nameRequired);
            return;
        }

        if (enteredName.trim() !== expectedName.trim()) {
            setError(nameMismatch);
            return;
        }

        setError('');
        onConfirm();
    };

    const handleCancel = () => {
        setEnteredName('');
        setError('');
        onCancel();
    };

    const handleNameChange = (value: string) => {
        setEnteredName(value);
        if (error) {
            setError('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={open => !open && handleCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-destructive">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name-confirmation" className="text-sm font-medium">
                            {nameConfirmation}
                        </Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                            <span className="text-sm font-medium">{expectedName}</span>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="name-input" className="text-sm font-medium">
                            {nameConfirmation}
                        </Label>
                        <Input
                            id="name-input"
                            value={enteredName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder={namePlaceholder}
                            className="mt-1"
                        />
                        {error && (
                            <p className="text-sm text-destructive mt-1">{error}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} type="button" className="flex-1 py-2 px-4">
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleConfirm}
                        type="button"
                        className="flex-1 py-2 px-4 text-destructive border-destructive hover:bg-destructive hover:text-white"
                        disabled={!enteredName.trim()}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 