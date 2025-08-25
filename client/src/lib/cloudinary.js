import authAxios from '@/lib/auth-axios';

//This function does not append file to formData
export async function getSignatureWithFormData(type, id) {
  const { data } = await authAxios.get(
    `/api/cloudinary-upload-signature/image?type=${type}&id=${id}`
  );

  const formData = new FormData();
  for (let key in data) {
    let value = data[key];
    if (value === 'cloud_name') continue; // Skip cloud_name as it's not needed in the form data
    formData.append(key, value);
  }

  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${data.cloud_name}/auto/upload`;

  return [formData, cloudinaryUploadUrl];
}
