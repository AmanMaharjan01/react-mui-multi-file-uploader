/// <reference types="react" />
interface IFileUpload {
    files: File[] | null;
    setFiles: (e: File[] | null) => void;
    removeRedundants?: boolean;
    disabledDragAndDrop?: boolean;
}
export default function FileUpload({ files, setFiles, removeRedundants, disabledDragAndDrop, }: IFileUpload): JSX.Element;
export declare const PdfIcon: JSX.Element;
export declare const TxtIcon: JSX.Element;
export declare const VideoIcon: JSX.Element;
export {};
