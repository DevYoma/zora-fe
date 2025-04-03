import {Link} from "react-router-dom"
import { Github, Twitter, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NFTicket
            </h3>
            <p className="text-sm text-muted-foreground">
              Own Your Ticket. Experience True Ownership.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-muted-foreground hover:text-foreground transition-colors">
                  Verify Tickets
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Zora Integration
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Web3 Guides
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NFTicket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
