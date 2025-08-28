const Index = () => {
  console.log("Index component is rendering");
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">
          🎯 Coupon Click Hub
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Sistema de afiliados e cupons em construção
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Sistema funcionando corretamente!
        </div>
      </div>
    </div>
  )
}

export default Index