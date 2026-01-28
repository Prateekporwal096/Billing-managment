import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Package, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDataStore } from '@/stores/dataStore';
import { formatDate } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function StockMovement() {
  const { stockMovements, products } = useDataStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMovements = useMemo(() => {
    return stockMovements
      .filter((movement) => {
        const matchesSearch =
          movement.productName.toLowerCase().includes(search.toLowerCase()) ||
          movement.reference.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || movement.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stockMovements, search, typeFilter]);

  const stats = useMemo(() => {
    const totalPurchases = stockMovements
      .filter((m) => m.type === 'purchase')
      .reduce((sum, m) => sum + m.quantity, 0);
    const totalSales = stockMovements
      .filter((m) => m.type === 'sale')
      .reduce((sum, m) => sum + m.quantity, 0);
    const totalAdjustments = stockMovements
      .filter((m) => m.type === 'adjustment')
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    return { totalPurchases, totalSales, totalAdjustments };
  }, [stockMovements]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Movement History</h1>
          <p className="text-muted-foreground">Track all inventory movements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card p-6 rounded-lg border border-white/10 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Purchases</p>
              <p className="text-2xl font-bold mt-2">{stats.totalPurchases}</p>
              <p className="text-xs text-green-500 mt-1">Stock In</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg border border-white/10 hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold mt-2">{stats.totalSales}</p>
              <p className="text-xs text-red-500 mt-1">Stock Out</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Adjustments</p>
              <p className="text-2xl font-bold mt-2">{stats.totalAdjustments}</p>
              <p className="text-xs text-blue-500 mt-1">Manual Changes</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Movement History */}
      <div className="glass-card p-6 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Date</th>
                  <th className="text-left p-4 font-semibold text-sm">Product</th>
                  <th className="text-center p-4 font-semibold text-sm">Type</th>
                  <th className="text-right p-4 font-semibold text-sm">Quantity</th>
                  <th className="text-left p-4 font-semibold text-sm">Reference</th>
                  <th className="text-right p-4 font-semibold text-sm">Current Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((movement) => {
                  const product = products.find((p) => p.id === movement.productId);
                  return (
                    <tr
                      key={movement.id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(movement.date)}
                      </td>
                      <td className="p-4 font-medium">{movement.productName}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1 ${
                            movement.type === 'purchase'
                              ? 'bg-green-500/20 text-green-500'
                              : movement.type === 'sale'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-blue-500/20 text-blue-500'
                          }`}
                        >
                          {movement.type === 'purchase' && (
                            <TrendingUp className="h-3 w-3" />
                          )}
                          {movement.type === 'sale' && <TrendingDown className="h-3 w-3" />}
                          {movement.type === 'adjustment' && <Package className="h-3 w-3" />}
                          {movement.type}
                        </span>
                      </td>
                      <td
                        className={`p-4 text-right font-semibold ${
                          movement.type === 'purchase'
                            ? 'text-green-500'
                            : movement.type === 'sale'
                            ? 'text-red-500'
                            : 'text-blue-500'
                        }`}
                      >
                        {movement.type === 'purchase' ? '+' : movement.type === 'sale' ? '-' : '±'}
                        {movement.quantity}
                      </td>
                      <td className="p-4 text-sm font-mono text-muted-foreground">
                        {movement.reference}
                      </td>
                      <td className="p-4 text-right font-medium">{product?.stock || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No stock movements found</p>
          </div>
        )}
      </div>
    </div>
  );
}
