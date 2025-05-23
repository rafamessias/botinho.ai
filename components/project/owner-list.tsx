import { OwnerItem } from './owner-item';

const dummyOwners = [
    {
        name: 'João da Silva',
        email: 'joaodasilva@terra.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        name: 'Maria Aparecida da Silva',
        email: 'mariaap@uol.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
];

export function OwnerList() {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-semibold text-base">Proprietários</span>
            <span className="text-xs text-muted-foreground">Adicione quem do cliente irá acompanhar o projeto</span>
            <div className="flex flex-col gap-2 mt-2">
                {dummyOwners.map((owner) => (
                    <OwnerItem key={owner.email} {...owner} />
                ))}
            </div>
            <button className="w-full mt-2 py-2 rounded-lg border bg-secondary text-primary font-medium">Adicionar</button>
        </div>
    );
} 