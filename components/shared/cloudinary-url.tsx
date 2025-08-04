

const CloudinaryUrl = ({ version, publicId, format }: { version: string, publicId: string, format: string }) => {
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${version}/${publicId}.${format}`
}

export default CloudinaryUrl;