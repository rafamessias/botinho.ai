export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Obraguru. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Termos
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacidade
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}
