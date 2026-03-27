import { v2 as cloudinary } from 'cloudinary';

// O SDK v2 deteta automaticamente a variável CLOUDINARY_URL se estiver no .env.
// Caso use variáveis separadas, configuramos explicitamente.
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Utilitário para apagar imagem do Cloudinary pela URL
 * Baseado no padrão que partilhou
 */
export async function deleteCloudinaryImage(url: string) {
  if (!url || !url.includes('cloudinary')) return;
  
  try {
    const parts = url.split('/');
    // Procura a pasta raiz do projeto nas URLs do Cloudinary
    const projectIndex = parts.indexOf('paroquiaperto');
    if (projectIndex === -1) return;

    const folderParts = parts.slice(projectIndex);
    const publicId = folderParts.join('/').split('.')[0];
    
    await cloudinary.uploader.destroy(publicId);
    console.log('[Cloudinary] Imagem apagada:', publicId);
  } catch (error) {
    console.error('[Cloudinary Delete Error]', error);
  }
}

export default cloudinary;
