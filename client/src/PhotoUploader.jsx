import axios from "axios";
import { useState } from "react";

export default function PhotosUploader({ addedPhotos = [], onChange = () => { } }) {
    const [photoLink, setPhotoLink] = useState('');
    const [hovered, setHovered] = useState(false);

    async function addPhotobyLink(ev) {
        ev.preventDefault();
        const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
        onChange((prev) => [...(prev || []), filename]);
        setPhotoLink('');
    }

    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();

        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }

        axios.post('/upload', data, {
            headers: { 'Content-type': 'multipart/form-data' },
        }).then((response) => {
            const { data: filenames } = response;
            onChange((prev) => [...(prev || []), ...filenames]);
        });
    }

    function removePhoto(ev,filename) {
        ev.preventDefault();
        onChange([...addedPhotos.filter(photo => photo !== filename)]);

    }

    function selectAsMainPhoto(ev,filename){
      ev.preventDefault();
      const addedPhotoWithoutSelected = addedPhotos.filter(photo=> photo != filename);
      const newAddedPhotos = [filename,...addedPhotoWithoutSelected];
      onChange(newAddedPhotos);
    }
    return (
        <>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={photoLink}
                    onChange={(ev) => setPhotoLink(ev.target.value)}
                    placeholder={'Add using a link ...jpg'}
                />
                <button
                    onClick={addPhotobyLink}
                    className="text-base bg-gray-200 px-4 rounded-2xl"
                >
                    Add Photo
                </button>
            </div>
            <div className="mt-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 gap-3">
                {addedPhotos.length > 0 &&
                    addedPhotos.map((link) => (
                        <div
                            className="h-32 flex relative"
                            key={link}
                            onDoubleClick={() => setHovered(true)}
                           onClick ={() => setHovered(false)}
                            style={{
                                overflow: 'hidden',
                                transition: 'height 0.3s',
                                height: hovered ? '16rem' : '8rem',
                            }}
                        >
                            <img
                                className="rounded-2xl w-full object-cover object-center"
                                src={`http://localhost:3000/uploads/${link}`}
                                alt="image"

                            />
                            <div className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3" onClick={(ev) => removePhoto(ev,link)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            </div>
                            <div className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3" onClick={(ev) => selectAsMainPhoto( ev,link)}>
                                 {link === addedPhotos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                  </svg>
                                  
                                 )} 
                                  {link !== addedPhotos[0] && (
                                 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                                  )}

                            </div>
                        </div>
                    ))}
                <label className="h-32 cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 hover:bg-zinc-100">
                    <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Upload
                </label>
            </div>
        </>
    );
}
