using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.Helpers
{
    public class ImageHandler
    {
        public static async Task<string> SaveImageFile(IFormFile imageFile, string targetFolderPath)
        {
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

            string filePath = Path.Combine(targetFolderPath, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return filePath;
        }

        public async static Task<string> SaveGoogleImage(string imageUrl, string targetFolderPath)
        {
            string fileName = $"{Guid.NewGuid()}.jpg";

            string filePath = Path.Combine(targetFolderPath, fileName);

            using var httpClient = new HttpClient();
            try
            {
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

                await File.WriteAllBytesAsync(filePath, imageBytes);

                return filePath;
            }
            catch (Exception ex)
            {
                throw new Exception("Error saving profile picture.", ex);
            }
        }

    }
}
