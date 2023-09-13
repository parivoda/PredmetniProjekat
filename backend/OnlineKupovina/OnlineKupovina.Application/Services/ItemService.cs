using AutoMapper;
using OnlineKupovina.Application.DTOs.ItemDTOs;
using OnlineKupovina.Application.Helpers;
using OnlineKupovina.Application.ServiceInterfaces;
using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.RepositoryInterfaces;

namespace OnlineKupovina.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Item> _itemsRepository;
        private readonly IRepository<User> _usersRepository;

        public ItemService(IMapper mapper, IRepository<Item> itemsRepository, IRepository<User> usersRepository)
        {
            _mapper = mapper;
            _itemsRepository = itemsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<ItemDto> AddItem(long id, AddItemDto newItem)
        {
            var seller = await _usersRepository.GetById(id);
            if (seller != null && seller.Verified)
            {
                if (int.TryParse(newItem.Quantity.ToString(), out int quantity) && double.TryParse(newItem.Price.ToString(), out double price))
                {
                    newItem.Quantity = quantity;
                    newItem.Price = price;
                    if (newItem.Quantity > 0 && newItem.Price > 0)
                    {
                        Item item = _mapper.Map<Item>(newItem);
                        item.SellerId = id;
                        if (newItem.ImageUri != null && newItem.ImageUri.Length > 0)
                        {
                            string imagePath = await ImageHandler.SaveImageFile(newItem.ImageUri, Path.Combine("Images", "Articles"));

                            item.ImageUri = imagePath;
                        }
                        else
                        {
                            string defaultImagePath = Path.Combine("Images", "Articles", "default-product-image.png");
                            item.ImageUri = defaultImagePath;
                        }

                        await _itemsRepository.Create(item);
                        await _itemsRepository.SaveChanges();
                        return _mapper.Map<ItemDto>(item);
                    }
                    else
                    {
                        throw new InvalidOperationException("Number fields must be greater than 0.");
                    }
                }
                else
                {
                    throw new InvalidOperationException("Please enter valid numbers for requested number fields.");
                }
            }
            else
            {
                throw new ArgumentNullException(nameof(seller));
            }

        }

        public async Task DeleteItem(long id)
        {
            var item = await _itemsRepository.GetById(id);
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            _itemsRepository.Delete(item);
            await _itemsRepository.SaveChanges();
        }

        public async Task<ItemDto> GetItem(long id)
        {
            var item = await _itemsRepository.GetById(id);
            if (item == null)
                throw new ArgumentNullException(nameof(item));

            return _mapper.Map<ItemDto>(item);

        }

        public async Task<List<ItemDto>> GetItems()
        {
            var items = await _itemsRepository.GetAll();
            if (items.Any())
                return _mapper.Map<List<ItemDto>>(items);
            throw new ArgumentNullException();
        }

        public async Task<List<ItemDto>> GetSellerItems(long id)
        {
            var items = await _itemsRepository.FindAllBy(x => x.SellerId == id);
            if (items.Any())
                return _mapper.Map<List<ItemDto>>(items);
            throw new ArgumentNullException();
        }

        public async Task<ItemDto> UpdateItem(UpdateItemDto item)
        {
            var itemToUpdate = await _itemsRepository.GetById(item.Id);
            if (itemToUpdate == null)
            {
                throw new ArgumentNullException(nameof(itemToUpdate));
            }
            else
            {
                if (int.TryParse(item.Quantity.ToString(), out int quantity) && double.TryParse(item.Price.ToString(), out double price))
                {
                    if (quantity > 0 && price > 0)
                    {
                        if (item.ImageUri != null && item.ImageUri.Length > 0)
                        {
                            string imagePath = await ImageHandler.SaveImageFile(item.ImageUri, Path.Combine("Images", "Articles"));

                            itemToUpdate.ImageUri = imagePath;
                        }
                        else
                        {
                            itemToUpdate.ImageUri = itemToUpdate.ImageUri;
                        }

                        itemToUpdate.Name = item.Name;
                        itemToUpdate.Description = item.Description;
                        itemToUpdate.Price = price;
                        itemToUpdate.Quantity = quantity;
                    }
                    else
                    {
                        throw new InvalidOperationException("Number fields must be greater than 0.");
                    }
                }
                else
                {
                    throw new InvalidOperationException("Please enter valid numbers for requested number fields.");
                }

                await _itemsRepository.SaveChanges();

                return _mapper.Map<ItemDto>(itemToUpdate);
            }
        }
    }
}
