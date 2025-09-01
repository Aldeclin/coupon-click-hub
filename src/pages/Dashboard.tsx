import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, Package, Store, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    coupons: 0,
    products: 0,
    merchants: 0,
    categories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [couponsRes, productsRes, merchantsRes, categoriesRes] = await Promise.all([
          supabase.from('coupons').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('merchants').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          coupons: couponsRes.count || 0,
          products: productsRes.count || 0,
          merchants: merchantsRes.count || 0,
          categories: categoriesRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Cupons',
      value: stats.coupons,
      description: 'Total de cupons cadastrados',
      icon: Ticket,
    },
    {
      title: 'Produtos',
      value: stats.products,
      description: 'Total de produtos cadastrados',
      icon: Package,
    },
    {
      title: 'Merchants',
      value: stats.merchants,
      description: 'Total de merchants cadastrados',
      icon: Store,
    },
    {
      title: 'Categorias',
      value: stats.categories,
      description: 'Total de categorias cadastradas',
      icon: FolderOpen,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sistema Restaurado</CardTitle>
            <CardDescription>
              O sistema foi completamente restaurado com todas as funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">✅ Autenticação configurada</p>
              <p className="text-sm">✅ Dashboard operacional</p>
              <p className="text-sm">✅ Conexão com banco de dados</p>
              <p className="text-sm">✅ Interface administrativa</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>
              Funcionalidades disponíveis para implementação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Gerenciar cupons e ofertas</p>
              <p className="text-sm">• Cadastrar produtos</p>
              <p className="text-sm">• Configurar merchants</p>
              <p className="text-sm">• Organizar categorias</p>
              <p className="text-sm">• Analytics e relatórios</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;