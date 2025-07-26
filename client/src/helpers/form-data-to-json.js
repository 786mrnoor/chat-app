export default function formDataToJson(formData) {
  const obj = {};
  formData.forEach((v, k) => {
    if (obj[k]) {
      if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    } else {
      obj[k] = v;
    }
  });
  return obj;
}
