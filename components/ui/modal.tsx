'use client'

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";

interface ModalProps {
    title: string;
    //title2:string;
    description: string;
    isOpen: boolean;
    //onClose: () => void;
    onClose(): void;
    children?: React.ReactNode;
};



export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {

    const onChange = (open: boolean) => {
        if (!open){
            onClose();
        }
    };

    return (
       <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div>
                {children}
            </div>
        </DialogContent>
       </Dialog> 
    );
};

// export function Modal({ 
//     title, 
//     //title2,
//     description, 
//     isOpen, 
//     onClose, 
//     children }: ModalProps) {


//         function onChange(open: boolean){
//             if (!open){
//                 onClose();
//             }
//         }

//     return (
//        <Dialog open={isOpen} onOpenChange={onChange}>
//         <DialogContent>
//             <DialogHeader>
//                 <DialogTitle>{title}</DialogTitle>
//                 <DialogDescription>{description}</DialogDescription>
//             </DialogHeader>
//             <div>
//                 {children}
//             </div>
//         </DialogContent>
//        </Dialog> 
//     );
// };