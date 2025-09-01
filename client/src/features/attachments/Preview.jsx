export default function Preview({ type, url, className, isThumbnail }) {
  if (type === 'image') return <img src={url} alt='' className={className} />;
  else if (type === 'video')
    return <video src={url} className={className} controls={!isThumbnail} />;
}
