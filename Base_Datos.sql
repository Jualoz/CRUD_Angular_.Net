
create database DBCrud

go

use DBCrud

create table Inventario(
IdProducto int primary key identity,
Nombre varchar(50),
ValorCompra decimal(10,2),
Stock int
)

go

create table Venta(
IdVenta int primary key identity,
Cantidad int,
ValorVenta decimal(10,2),
Fecha date,
IdProductoFk int,
constraint IdProductoFk foreign key (IdProductoFk) references Inventario(IdProducto)
)

go

insert into Inventario(Nombre,ValorCompra,Stock)
values 
	('Leche descremada', 2.50, 100),
    ('Arroz blanco', 1.20, 200),
    ('Aceite de oliva extra virgen', 8.75, 50),
    ('Pasta de trigo integral', 1.80, 150),
    ('Pollo fresco', 3.50, 80),
    ('Tomates orgánicos', 2.00, 120),
    ('Manzanas Fuji', 1.75, 100),
    ('Pan integral', 1.30, 180),
    ('Yogur natural', 1.00, 120),
    ('Aguacates Hass', 2.25, 90)

go 

create proc AgregarVentas
as

DECLARE @StartDate DATE = '2024-04-28';
DECLARE @EndDate DATE = '2024-05-03';
DECLARE @Counter INT = 1;

WHILE @Counter <= 15
BEGIN
    DECLARE @RandomDate DATE;
    SET @RandomDate = DATEADD(DAY, ABS(CHECKSUM(NEWID()) % DATEDIFF(DAY, @StartDate, @EndDate)), @StartDate);
    
    DECLARE @Cantidad INT;
    DECLARE @ValorVenta DECIMAL(10,2);
    DECLARE @IdProductoFk INT;

    SELECT TOP 1
        @Cantidad = CAST(ROUND(RAND() * 10, 0) + 1 AS INT), -- Cantidad aleatoria entre 1 y 10
        @ValorVenta = CAST(ROUND(I.ValorCompra * 1.20, 2) AS DECIMAL(10,2)), -- ValorVenta: 20% más del valor de compra
        @IdProductoFk = I.IdProducto -- Selecciona un producto aleatorio
    FROM 
        Inventario I
    ORDER BY 
        NEWID(); -- Orden aleatorio de los productos

    INSERT INTO Venta (Cantidad, ValorVenta, Fecha, IdProductoFk)
    VALUES 
        (@Cantidad, @ValorVenta, @RandomDate, @IdProductoFk);

    -- Actualizar el stock
    UPDATE Inventario
    SET Stock = Stock - @Cantidad
    WHERE IdProducto = @IdProductoFk;
    
    SET @Counter = @Counter + 1;
END

go 

exec AgregarVentas

go

create proc listaInventario
as
begin
	select 
		IdProducto,
		Nombre,
		ValorCompra,
		Stock
	from Inventario
end

go

create proc ObtenerProducto(@IdProducto int)
as
begin
	select 
		IdProducto,
		Nombre,
		ValorCompra,
		Stock
	from Inventario where IdProducto = @IdProducto
end

go 

create proc CrearProducto(
@Nombre varchar(50),
@ValorCompra decimal(10,2),
@Stock int)
as
begin
	insert into Inventario(
	Nombre,
	ValorCompra,
	Stock)
	values 
		(@Nombre, 
		@ValorCompra,
		@Stock)
end

go

create proc EditarProducto(
@IdProducto int,
@Nombre varchar(50),
@ValorCompra decimal(10,2),
@Stock int)
as
begin
	update Inventario
	set 
	Nombre = @Nombre,
	ValorCompra = @ValorCompra,
	Stock = @Stock
	where IdProducto = @IdProducto
end

go

create proc EliminarProducto(@IdProducto int)
as
begin
	delete from Inventario where IdProducto = @IdProducto
end

go

create proc listaVenta
as
begin
	select
		IdVenta,
		Cantidad,
		ValorVenta,
		CONVERT(char(10), Fecha, 103)[Fecha],
		IdProductoFk
	from Venta
end

go

create proc ObtenerVenta(@IdVenta int)
as
begin
	select 
		IdVenta,
		Cantidad,
		ValorVenta,
		CONVERT(char(10), Fecha, 103)[Fecha],
		IdProductoFk
	from Venta where IdVenta= @IdVenta
end

go

create proc RealizarVenta(
    @IdProducto int,
    @Cantidad int,
    @Fecha date)
as
begin
	set dateformat dmy

    -- Insertar la venta
    insert into Venta (
	Cantidad, 
	ValorVenta, 
	Fecha, 
	IdProductoFk)
    values 
        (@Cantidad, 
		(select ValorCompra * 1.20 from Inventario where IdProducto = @IdProducto), 
		convert(date, @Fecha), 
		@IdProducto)

    -- Actualizar el stock
    UPDATE Inventario
    set Stock = Stock - @Cantidad
    where IdProducto = @IdProducto;
end

delete from Venta
