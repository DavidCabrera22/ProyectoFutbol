FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TopFutbolAPI/TopFutbolAPI.csproj", "TopFutbolAPI/"]
RUN dotnet restore "TopFutbolAPI/TopFutbolAPI.csproj"
COPY . .
WORKDIR "/src/TopFutbolAPI"
RUN dotnet build "TopFutbolAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TopFutbolAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TopFutbolAPI.dll"]