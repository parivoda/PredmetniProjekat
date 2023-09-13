using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineKupovina.Infrastructure.Migrations
{
    public partial class Trying : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "OrderingTime",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2011, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 8, 29, 13, 53, 26, 69, DateTimeKind.Local).AddTicks(1858));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "OrderingTime",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 8, 29, 13, 53, 26, 69, DateTimeKind.Local).AddTicks(1858),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2011, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
