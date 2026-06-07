import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toCanvas } from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">QR Code Generator</h1>
      <div class="qr-card">
        <div class="card-header">
          <span>Current QR Code</span>
          <button class="refresh-btn" (click)="regenerate()">↺ Refresh</button>
        </div>
        <canvas #qrCanvas width="220" height="220"></canvas>
        <div class="code-number">{{ lastCode }}</div>
        <div class="timer-row">
          <span>Expires in</span>
          <strong>{{ expiresIn }}s</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="progressPct"></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { margin: 0; font-size: 2rem; color: #0f172a; font-weight: 700; }
    .qr-card {
      width: max-content;
      background: #fff; border-radius: 24px; padding: 32px;
      box-shadow: 0 18px 50px rgba(15,23,42,0.08);
      display: flex; flex-direction: column;
      align-items: center; gap: 16px;
      border: 1px solid #e0e7ff;
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      width: 100%; font-weight: 700; font-size: 15px; color: #1e293b;
    }
    .refresh-btn {
      background: #eef2ff; border: none; border-radius: 8px;
      padding: 6px 14px; color: #5b6cf6; font-weight: 600;
      cursor: pointer; font-size: 13px;
    }
    .refresh-btn:hover { background: #e0e7ff; }
    canvas {
      border-radius: 12px; border: 2px solid #e0e7ff;
      display: block; width: 280px; height: 280px;
    }
    .code-number { font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 6px; }
    .timer-row { display: flex; align-items: center; gap: 10px; color: #64748b; font-size: 0.95rem; }
    .timer-row strong { color: #5b6cf6; font-size: 1.1rem; font-weight: 700; }
    .progress-track { width: 280px; height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
    .progress-fill {
      height: 100%; background: linear-gradient(90deg, #5b6cf6 0%, #9d7bff 100%);
      transition: width 0.25s linear;
    }
  `]
})
export class QrGeneratorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  expiresIn = 30;
  lastCode = '';
  private ticker: number | undefined;

  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.startTicker();
  }

  ngAfterViewInit() {
    this.loadFromDB();
  }

  ngOnDestroy() {
    if (this.ticker !== undefined) clearInterval(this.ticker);
  }

  loadFromDB() {
    this.http.get<any>('http://localhost/Xorvia/backend/qr.php').subscribe({
      next: (res) => {
        if (res.success) {
          this.zone.run(() => {
            this.lastCode = res.code;
            this.expiresIn = 30;
            this.cd.markForCheck();
          });
          this.renderQR(res.code);
        }
      },
      error: () => this.generateLocal()
    });
  }

  regenerate() {
  this.http.post<any>('http://localhost/Xorvia/backend/qr.php', {}).subscribe({
    next: (res) => {
      if (res.success) {
        this.zone.run(() => {
          this.lastCode = res.code;
          this.expiresIn = 30;
          this.cd.markForCheck();
        });
        this.renderQR(res.code);
      }
    },
    error: () => this.generateLocal()
  });
}

  generateLocal() {
    let code: string;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (code === this.lastCode);
    this.zone.run(() => {
      this.lastCode = code;
      this.expiresIn = 30;
      this.cd.markForCheck();
    });
    this.renderQR(code);
  }

  async renderQR(code: string) {
    const canvas = this.qrCanvas?.nativeElement;
    if (!canvas) return;
    try {
      await toCanvas(canvas, code, {
        width: 220,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    } catch (err) {
      console.error('QR render failed', err);
    }
  }

  startTicker() {
  if (this.ticker !== undefined) return;
  this.ticker = window.setInterval(() => {
    this.zone.run(() => {
      this.expiresIn = Math.max(0, this.expiresIn - 1);
      this.cd.markForCheck();
      if (this.expiresIn <= 0) {
        this.regenerate();  
      }
    });
  }, 1000);
}

  get progressPct(): number {
    return (this.expiresIn / 30) * 100;
  }
}