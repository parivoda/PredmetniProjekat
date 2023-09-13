using AutoMapper;
using OnlineKupovina.Application.DTOs.ItemDTOs;
using OnlineKupovina.Application.DTOs.OrderDto;
using OnlineKupovina.Application.DTOs.UserDTOs;
using OnlineKupovina.Domain.Models;

namespace OnlineKupovina.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UpdateUserProfile>().ReverseMap();
            CreateMap<User, UserInfoDto>().ReverseMap();
            CreateMap<User, VerificationDto>().ReverseMap();
            CreateMap<User, UserProfileDto>().ReverseMap();

            CreateMap<Item, ItemDto>().ReverseMap();
            CreateMap<Item, AddItemDto>().ReverseMap();
            CreateMap<Item, OrderDetailDto>().ReverseMap();
            CreateMap<Item, UpdateItemDto>().ReverseMap();

            CreateMap<Order, OrderListCustomerDto>().ReverseMap();
            CreateMap<Order, OrderListDto>().ReverseMap();
            CreateMap<Order, PendingOrders>().ReverseMap();
        }
    }
}
