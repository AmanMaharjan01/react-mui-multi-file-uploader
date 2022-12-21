# react-mui-multi-file-uploader

In the project directory, you can install package by:

```
$ npm i react-mui-multi-file-uploader
```

## Example

```
import { useState } from "react";
import FileUpload from "./components/src/FileUpload";

function App() {
  const [files, setFiles] = useState<File[] | null>(null);
  return (
    <div className="App">
      <FileUpload files={files} setFiles={setFiles} />
    </div>
  );
}

export default App;
```

## Props

| Name                |   Type   |                              Description |
| :------------------ | :------: | ---------------------------------------: |
| files               |  Array   |                   State of list of files |
| setFiles            | Function |       Setter to store files in the state |
| removeRedundants    | Boolean  | filters out redundant data automatically |
| disabledDragAndDrop | Boolean  |       disables drag & drop functionality |
