import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const Index = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Coupon Click Hub
        </h1>
        <p className="text-muted-foreground mb-8">
          Sistema de gerenciamento de cupons e afiliados
        </p>
        <div className="space-x-4">
          {user ? (
            <Link to="/dashboard">
              <Button>Acessar Dashboard</Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button>Fazer Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index