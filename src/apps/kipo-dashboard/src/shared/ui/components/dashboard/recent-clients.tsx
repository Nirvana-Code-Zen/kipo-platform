"use client"

import { Avatar, AvatarFallback, AvatarImage, Button, Card } from "@kipo/ui-react"
import { Plus } from "lucide-react"

const clients = [
  {
    name: "Femsa Comercio SA",
    invoice: "Venta de mercancía",
    status: "Timbrada",
    statusColor: "bg-emerald-100 text-emerald-700",
    avatar: "FC",
    avatarImage: "/avatars/avatar-1.jpg",
  },
  {
    name: "Grupo Bimbo SAB",
    invoice: "Servicio de consultoría",
    status: "En proceso",
    statusColor: "bg-amber-100 text-amber-700",
    avatar: "GB",
    avatarImage: "/avatars/avatar-2.jpg",
  },
  {
    name: "El Palacio de Hierro",
    invoice: "Arrendamiento de inmueble",
    status: "Pendiente",
    statusColor: "bg-rose-100 text-rose-700",
    avatar: "PH",
    avatarImage: "/avatars/avatar-3.jpg",
  },
  {
    name: "Liverpool SA de CV",
    invoice: "Comisión por servicios",
    status: "En proceso",
    statusColor: "bg-amber-100 text-amber-700",
    avatar: "LV",
    avatarImage: "/avatars/avatar-4.jpg",
  },
]

export function RecentClients() {
  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "600ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Clientes recientes</h2>
        <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 bg-transparent">
          <Plus className="w-4 h-4 mr-1" />
          Agregar cliente
        </Button>
      </div>
      <div className="space-y-4">
        {clients.map((client, index) => (
          <div
            key={client.name}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-all duration-300 cursor-pointer group"
            style={{ animationDelay: `${650 + index * 100}ms` }}
          >
            <Avatar className="w-12 h-12 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
              <AvatarImage src={client.avatarImage || "/placeholder.svg"} alt={client.name} className='object-cover w-full h-full' />
              <AvatarFallback className="bg-primary text-primary-foreground">{client.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{client.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                Última factura: <span className="font-medium">{client.invoice}</span>
              </p>
            </div>
            <span
              className={`${client.statusColor} text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-300 group-hover:scale-105 whitespace-nowrap`}
            >
              {client.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
