"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Shield,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowLeft,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    zipCode: "",
    address: "",
    city: "",
    state: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return value
  }

  const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length <= 11) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulação de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-green-200">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-full">
                <CheckCircle2 className="w-20 h-20 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Pagamento Confirmado!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Bem-vindo ao plano premium! 🎉
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <Sparkles className="w-5 h-5" />
                <p className="font-semibold">Sua assinatura está ativa</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Você receberá um email de confirmação em breve com todos os detalhes.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <Link href="/">
                <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Começar Agora
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-white hover:text-yellow-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="text-center space-y-4">
            <div className="inline-block animate-pulse">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg px-6 py-2 font-bold">
                <Zap className="w-5 h-5 mr-2 inline" />
                BLACK FRIDAY
              </Badge>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Oferta Exclusiva!
            </h1>
            <p className="text-gray-300 text-lg">
              Complete seus dados e garanta o desconto
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <Card className="border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dados Pessoais
                  </CardTitle>
                  <CardDescription className="text-gray-900">
                    Informações básicas para sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="João Silva"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        CPF
                      </Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value)
                          setFormData(prev => ({ ...prev, cpf: formatted }))
                        }}
                        maxLength={14}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="joao@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value)
                          setFormData(prev => ({ ...prev, phone: formatted }))
                        }}
                        maxLength={15}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço de Cobrança
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    Onde você receberá as faturas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="00000-000"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Rua, número, complemento"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="São Paulo"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="SP"
                        maxLength={2}
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card className="border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Dados do Cartão
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Pagamento seguro e criptografado
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Número do Cartão
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        setFormData(prev => ({ ...prev, cardNumber: formatted }))
                      }}
                      maxLength={19}
                      required
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="JOÃO SILVA"
                      value={formData.cardName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, cardName: e.target.value.toUpperCase() }))
                      }}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Validade
                      </Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/AA"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value)
                          setFormData(prev => ({ ...prev, expiryDate: formatted }))
                        }}
                        maxLength={5}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="000"
                        type="password"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Pagamento 100% Seguro
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Seus dados são criptografados e protegidos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black transition-all duration-300 shadow-lg shadow-yellow-500/50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 w-6 h-6" />
                    Garantir Desconto Agora
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card className="border-2 border-yellow-500 shadow-lg shadow-yellow-500/30">
                <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                    <Zap className="w-6 h-6 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">Plano Premium</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Assinatura mensal
                        </p>
                      </div>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                        BLACK FRIDAY
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Treinos personalizados</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Plano alimentar completo</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Vídeos demonstrativos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Acompanhamento de progresso</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Suporte prioritário</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Preço Original</span>
                        <span className="font-medium line-through text-gray-500">R$ 100,00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Desconto Black Friday</span>
                        <span className="font-medium text-green-600">-R$ 54,10</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <div className="text-right">
                        <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                          R$ 45,90
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          por mês
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-lg border-2 border-yellow-400">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        <p className="font-bold text-orange-900 dark:text-orange-100">
                          Economia de 54%!
                        </p>
                      </div>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Oferta válida apenas durante a Black Friday
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="font-bold text-yellow-900 dark:text-yellow-100">
                        Garantia de 7 dias
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Não gostou? Devolvemos 100% do seu dinheiro sem perguntas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
                    <Lock className="w-5 h-5" />
                    <Shield className="w-5 h-5" />
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-center mt-3 text-gray-600 dark:text-gray-400">
                    Pagamento seguro com criptografia SSL
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
