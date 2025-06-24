import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

export default async function uploadImage(path, file) {
  const fileRef = ref(storage, `${path}/${file.name}_${Date.now()}`);
  await uploadBytes(fileRef, file);
  const imageUrl = await getDownloadURL(fileRef);
  return imageUrl;
}
