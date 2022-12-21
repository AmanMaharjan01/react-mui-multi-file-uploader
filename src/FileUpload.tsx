import AttachFileRoundedIcon from "@mui/icons-material/AttachFileOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import {
  Box,
  Button,
  Divider,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  styled,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface IFileUrl {
  type: string;
  name: string;
  src?: string;
}

const DisplayImage = styled("img")({
  height: "100px",
  width: "100%",
  objectFit: "contain",
});

const DisplayIcon = styled("div")({
  height: "100px",
  objectFit: "contain",
});

const CustomButton = styled(Button)({
  textTransform: "capitalize",
});

const DeleteImage = styled(IconButton)({
  position: "absolute",
  right: "-15px",
  top: "15px",
  transform: "translate(-50%,-50%)",
});

interface IFileUpload {
  files: File[] | null;
  setFiles: (e: File[] | null) => void;
  removeRedundants?: boolean;
  disabledDragAndDrop?: boolean;
}

export default function FileUpload({
  files,
  setFiles,
  removeRedundants = true,
  disabledDragAndDrop = false,
}: IFileUpload) {
  const [fileUrl, setFileUrl] = useState<IFileUrl[] | []>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeRedundantFiles = (fileArray: File[]) => {
    const filteredFiles = fileArray.map((x) => {
      const alreadyExists = files?.find(
        (y) => x?.name === y?.name && x?.type === y?.type
      );
      if (!alreadyExists) {
        return x;
      }
      return null;
    });
    return filteredFiles?.filter((el) => el) as File[];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addedFiles = Array.from(e?.target?.files ?? []);
    const filteredData: File[] = removeRedundants
      ? removeRedundantFiles(addedFiles)
      : addedFiles;
    setFiles([...(files ?? []), ...filteredData]);
  };

  const openUploader = () => {
    inputRef?.current?.click();
  };

  useEffect(() => {
    let fileUrls: IFileUrl[] = [];
    Array.from(files ?? [])?.map((file) => {
      if (file?.type?.includes("image")) {
        fileUrls.push({
          type: file?.type,
          name: file?.name,
          src: URL.createObjectURL(file),
        });
      } else {
        fileUrls.push({
          type: file?.type,
          name: file?.name,
        });
      }
      return null;
    });
    setFileUrl(fileUrls ?? []);
  }, [files]);

  const handleDrop = (e: any) => {
    e.preventDefault();
    const addedFiles: File[] = Array.from(e?.dataTransfer?.files ?? []);
    const filteredData: File[] = removeRedundants
      ? removeRedundantFiles(addedFiles)
      : addedFiles;
    setFiles([...(files ?? []), ...filteredData]);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <input
        type="file"
        ref={inputRef}
        style={{
          display: "none",
        }}
        multiple={true}
        onChange={handleFileUpload}
      />

      {disabledDragAndDrop ? (
        <CustomButton variant="contained" onClick={openUploader}>
          <AttachFileRoundedIcon fontSize="small" /> Upload Files
        </CustomButton>
      ) : (
        <Box
          width="100%"
          minWidth="300px"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          height="100px"
          border="1px dashed #c3c3c3"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          onClick={openUploader}
          style={{
            cursor: "pointer",
          }}
          id="custom_drop_zone"
        >
          <DriveFolderUploadRoundedIcon fontSize="large" />
          <Box className="description">
            <strong>Choose a file</strong>
            <Box component="span" paddingLeft="5px">
              or drag it here{" "}
            </Box>
          </Box>
        </Box>
      )}
      {files?.length && (
        <Divider
          sx={{
            my: 2,
          }}
        />
      )}
      <DisplayFiles fileUrl={fileUrl} files={files} setFiles={setFiles} />
    </Box>
  );
}

const DisplayFiles = ({
  fileUrl,
  files,
  setFiles,
}: {
  fileUrl: IFileUrl[] | null;
  files: File[] | null;
  setFiles: (e: File[] | null) => void;
}) => {
  if (!fileUrl) {
    return <></>;
  }
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(125px,150px))"
      gap={1}
      sx={{
        "@media all and (max-width: 520px)": {
          gridTemplateColumns: "repeat(auto-fit, minmax(125px,auto))",
        },
      }}
    >
      {fileUrl.map((url, i) => (
        <Box key={i}>
          <FileComponent
            index={i}
            files={files}
            setFiles={setFiles}
            url={url}
          />
        </Box>
      ))}
    </Box>
  );
};

const FileComponent = ({
  url,
  files,
  setFiles,
  index,
}: {
  url: IFileUrl;
  files: File[] | null;
  index: number;
  setFiles: (e: File[] | null) => void;
}) => {
  const findIcon = (type: string) => {
    if (type.includes("pdf")) {
      return PdfIcon;
    }
    if (type.includes("video")) {
      return VideoIcon;
    }
    return TxtIcon;
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e?.target?.files?.[0];
    const newFileArray = files?.map((file, i) => {
      if (index === i) {
        return newFile ?? file;
      }
      return file;
    });
    setFiles(newFileArray ?? []);
  };

  const deleteImage = () => {
    const newFileArray = files?.filter((file, i) => index !== i);
    setFiles(newFileArray ?? []);
  };

  const singleInputRef = useRef<HTMLInputElement | null>(null);

  const fileUploader = () => {
    singleInputRef?.current?.click();
  };

  return (
    <ImageListItem
      key={url?.name}
      style={{
        position: "relative",
        height: "100%",
      }}
    >
      <input
        type="file"
        style={{
          display: "none",
        }}
        ref={singleInputRef}
        onChange={changeImage}
      />
      {url?.type?.includes("image") ? (
        <DisplayImage
          id="display-image"
          src={url.src}
          alt={url.name}
          loading="lazy"
        />
      ) : (
        <DisplayIcon id="display-icon">{findIcon(url?.type)}</DisplayIcon>
      )}
      <Tooltip title={url?.name} placement="top">
        <ImageListItemBar
          sx={{
            "& .MuiImageListItemBar-title": {
              fontSize: "0.8rem",
            },
          }}
          title={url.name}
          actionIcon={
            <IconButton
              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
              aria-label={`info about ${url.name}`}
              onClick={fileUploader}
            >
              <AutorenewRoundedIcon />
            </IconButton>
          }
        />
      </Tooltip>
      <DeleteImage size="small" onClick={deleteImage}>
        <ClearRoundedIcon />
      </DeleteImage>
    </ImageListItem>
  );
};

// icon svgs

export const PdfIcon = (
  <svg version="1.1" width="90%" height="90%" x="0" y="0" viewBox="0 0 512 512">
    <g>
      <path
        d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"
        fill="#e2e5e7"
        data-original="#e2e5e7"
      ></path>
      <path
        d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"
        fill="#b0b7bd"
        data-original="#b0b7bd"
      ></path>
      <polygon
        points="480,224 384,128 480,128 "
        fill="#cad1d8"
        data-original="#cad1d8"
      ></polygon>
      <path
        d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16
      V416z"
        fill="#f15642"
        data-original="#f15642"
      ></path>
      <g>
        <path
          d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48
          c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z
           M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z"
          fill="#ffffff"
          data-original="#ffffff"
        ></path>
        <path
          d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296
          c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z"
          fill="#ffffff"
          data-original="#ffffff"
        ></path>
        <path
          d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68
          h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912
          c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z"
          fill="#ffffff"
          data-original="#ffffff"
        ></path>
      </g>
      <path
        d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"
        fill="#cad1d8"
        data-original="#cad1d8"
      ></path>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </g>
  </svg>
);

export const TxtIcon = (
  <svg version="1.1" width="90%" height="90%" x="0" y="0" viewBox="0 0 512 512">
    <g>
      <path
        d="M104,0C86.328,0,72,14.328,72,32v448c0,17.672,14.328,32,32,32h304c17.672,0,32-14.328,32-32V128
      L312,0H104z"
        fill="#e2e7f0"
        data-original="#e2e7f0"
      ></path>
      <g>
        <path
          d="M344,128h96L312,0v96C312,113.672,326.328,128,344,128z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
        <path
          d="M192,160h128c4.416,0,8,3.584,8,8l0,0c0,4.416-3.584,8-8,8H192c-4.416,0-8-3.584-8-8l0,0
          C184,163.584,187.584,160,192,160z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
        <path
          d="M144,328h224c4.416,0,8,3.584,8,8l0,0c0,4.416-3.584,8-8,8H144c-4.416,0-8-3.584-8-8l0,0
          C136,331.584,139.584,328,144,328z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
        <path
          d="M144,424h128c4.416,0,8,3.584,8,8l0,0c0,4.416-3.584,8-8,8H144c-4.416,0-8-3.584-8-8l0,0
          C136,427.584,139.584,424,144,424z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
        <path
          d="M144,376h224c4.416,0,8,3.584,8,8l0,0c0,4.416-3.584,8-8,8H144c-4.416,0-8-3.584-8-8l0,0
          C136,379.584,139.584,376,144,376z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
        <path
          d="M144,280h224c4.416,0,8,3.584,8,8l0,0c0,4.416-3.584,8-8,8H144c-4.416,0-8-3.584-8-8l0,0
          C136,283.584,139.584,280,144,280z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
        <path
          d="M144,232h224c4.416,0,8,3.584,8,8l0,0c0,4.416-3.584,8-8,8H144c-4.416,0-8-3.584-8-8l0,0
          C136,235.584,139.584,232,144,232z"
          fill="#9dacba"
          data-original="#9dacba"
        ></path>
      </g>
      <path
        d="M344,128l75.28,75.28c3.024,3.008,4.72,7.096,4.72,11.36V480c0,8.84-7.16,16-16,16H120
      c-8.84,0-16,7.16-16,16h304c17.672,0,32-14.328,32-32V128H344z"
        fill="#c9d5e3"
        data-original="#c9d5e3"
      ></path>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </g>
  </svg>
);

export const VideoIcon = (
  <svg
    version="1.1"
    width="90%"
    height="90%"
    x="0"
    y="0"
    viewBox="0 0 791.454 791.454"
  >
    <g>
      <g>
        <g id="Vrstva_x0020_1_13_">
          <path
            clip-rule="evenodd"
            d="m202.808 0h264.609l224.265 233.758v454.661c0 56.956-46.079 103.035-102.838 103.035h-386.036c-56.956 0-103.035-46.079-103.035-103.035v-585.384c-.001-56.956 46.078-103.035 103.035-103.035z"
            fill="#7b7b7b"
            fill-rule="evenodd"
            data-original="#fa0000"
          ></path>
          <g fill="#fff">
            <path
              clip-rule="evenodd"
              d="m467.219 0v231.978h224.463z"
              fill-rule="evenodd"
              opacity=".302"
              fill="#ffffff"
              data-original="#ffffff"
            ></path>
            <path
              d="m395.826 359.141c-70.602 0-127.954 57.352-127.954 127.954s57.352 127.755 127.954 127.755 127.756-57.154 127.756-127.756-57.352-127.756-127.756-127.953zm53.792 131.909c-.989 1.78-2.373 3.164-4.153 4.153l-72.975 36.586c-4.549 2.175-10.086.396-12.261-4.153-.791-1.187-.989-2.571-.989-4.153v-72.975c0-5.142 4.153-9.097 9.097-9.097 1.384 0 2.769.198 4.153.989l72.975 36.389c4.549 2.372 6.328 7.712 4.153 12.261z"
              fill="#ffffff"
              data-original="#ffffff"
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
