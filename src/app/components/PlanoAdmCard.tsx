import { Edit, Trash2, CheckCircle, Smartphone } from 'lucide-react';
import { Botao } from './Botao';

interface PlanoAdmCardProps {
    id: number;
    nome: string;
    preco: number;
    precoOriginal?: number | null;
    periodo: 'MENSAL' | 'ANUAL';
    popular: boolean;
    ativo: boolean;
    totalMaterias: number;
    allowPix: boolean;
    onEditar: () => void;
    onExcluir: () => void;
}

const formatPrice = (centavos: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(centavos / 100);
};

export function PlanoAdmCard({
    nome,
    preco,
    precoOriginal,
    periodo,
    popular,
    ativo,
    totalMaterias,
    allowPix,
    onEditar,
    onExcluir,
}: PlanoAdmCardProps) {
    const hasDiscount = precoOriginal && precoOriginal > preco;
    const discountPercent = hasDiscount
        ? Math.round(((precoOriginal - preco) / precoOriginal) * 100)
        : null;

    return (
        <article className={`flex flex-col rounded-2xl border transition-all duration-200 bg-white h-full relative group hover:shadow-lg ${ativo ? 'border-border-light' : 'border-red-200 bg-red-50/30'
            }`}>
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                {!ativo && (
                    <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold font-lexend">
                        Inativo
                    </span>
                )}
                {popular && (
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-lexend">
                        Popular
                    </span>
                )}
                {allowPix && (
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center" title="Aceita PIX">
                        <Smartphone size={16} />
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                {/* Nome e Período */}
                <div className="mb-4 pr-12">
                    <h2 className="font-bold text-xl text-text-primary font-lexend mb-1">{nome}</h2>
                    <p className="text-sm text-text-secondary font-lexend">
                        {periodo === 'ANUAL' ? 'Cobrança Anual' : 'Cobrança Mensal'}
                    </p>
                </div>

                {/* Preço com desconto */}
                <div className="mb-6">
                    {hasDiscount && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-text-secondary line-through font-lexend">
                                {formatPrice(precoOriginal)}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold font-lexend">
                                -{discountPercent}%
                            </span>
                        </div>
                    )}
                    <span className="font-heading text-3xl font-bold text-text-primary">
                        {formatPrice(preco)}
                    </span>
                    <span className="text-sm text-text-secondary font-lexend ml-1">
                        /{periodo === 'ANUAL' ? 'ano' : 'mês'}
                    </span>
                </div>

                {/* Matérias */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="px-3 py-1.5 rounded-lg bg-bg-secondary text-text-secondary text-sm font-medium font-lexend flex items-center gap-2">
                        <CheckCircle size={14} className="text-primary" />
                        {totalMaterias} matéria{totalMaterias !== 1 ? 's' : ''} inclusa{totalMaterias !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Ações */}
                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
                    <Botao
                        variant="secondary"
                        size="sm"
                        onClick={onEditar}
                        leftIcon={Edit}
                        fullWidth
                    >
                        Editar
                    </Botao>
                    <Botao
                        variant="outline"
                        size="sm"
                        onClick={onExcluir}
                        leftIcon={Trash2}
                        className="text-red-500! hover:bg-red-50! hover:border-red-200!"
                        fullWidth
                    >
                        {ativo ? 'Desativar' : 'Excluir'}
                    </Botao>
                </div>
            </div>
        </article>
    );
}
