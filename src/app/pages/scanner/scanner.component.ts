import { Component, ElementRef, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsQR from 'jsqr';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">QR Code Scanner</h1>

      <div class="scanner-card">

        <!-- Manual Entry (Primary) -->
        <div class="manual-section">
          <div class="manual-title">Enter QR Code Manually</div>
          <div class="manual-desc">Type the 6-digit code shown on the QR Generator screen</div>
          <div class="manual-row">
            <input
              type="text"
              [(ngModel)]="manualCode"
              placeholder="Enter 6-digit code"
              maxlength="6"
              (keyup.enter)="submitManual()"
              class="code-input"
            />
            <button class="submit-btn" (click)="submitManual()" [disabled]="manualCode.length < 4">
              Mark Attendance
            </button>
          </div>
        </div>

        <div class="or-divider"><span>or use camera</span></div>

        <!-- Camera Scanner -->
        <div class="video-wrapper">
          <video #video autoplay muted playsinline></video>
          <div class="corner tl"></div>
          <div class="corner tr"></div>
          <div class="corner bl"></div>
          <div class="corner br"></div>
          <div class="scan-line" *ngIf="scanning"></div>
        </div>

        <button type="button" class="scanner-button" (click)="toggleScanning()">
          {{ scanning ? '⏹ Stop Camera' : '📷 Start Camera' }}
        </button>

        <div class="status-box" *ngIf="scanning">
          <div class="pulse-dot"></div>
          Scanning for QR code...
        </div>

        <div class="status-box error" *ngIf="errorMsg">
          ⚠️ {{ errorMsg }}
        </div>

        <!-- Result -->
        <div class="result-box success-box" *ngIf="attendanceMsg && attendanceSuccess">
          <div class="result-icon">✅</div>
          <div class="result-text">{{ attendanceMsg }}</div>
          <button class="reset-btn" (click)="reset()">Scan Again</button>
        </div>

        <div class="result-box fail-box" *ngIf="attendanceMsg && !attendanceSuccess">
          <div class="result-icon">❌</div>
          <div class="result-text">{{ attendanceMsg }}</div>
          <button class="reset-btn" (click)="reset()">Try Again</button>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0; }
    .scanner-card {
      max-width: 600px; width: 100%; background: white;
      border-radius: 24px; padding: 2rem;
      box-shadow: 0 18px 50px rgba(15,23,42,0.08);
      display: flex; flex-direction: column; gap: 1.25rem;
      border: 1px solid #e0e7ff;
    }
    .manual-section {
      background: #f8faff; border-radius: 16px;
      padding: 20px; border: 1.5px solid #e0e7ff;
    }
    .manual-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .manual-desc { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
    .manual-row { display: flex; gap: 10px; }
    .code-input {
      flex: 1; padding: 12px 16px;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: 20px; letter-spacing: 6px; font-weight: 700;
      outline: none; text-align: center;
    }
    .code-input:focus { border-color: #5b6cf6; }
    .submit-btn {
      padding: 12px 20px; border: none;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: #fff; border-radius: 10px;
      font-size: 14px; font-weight: 600; cursor: pointer;
      white-space: nowrap;
    }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .submit-btn:hover:not(:disabled) { opacity: 0.9; }
    .or-divider {
      display: flex; align-items: center; gap: 12px;
      color: #cbd5e1; font-size: 13px;
    }
    .or-divider::before, .or-divider::after {
      content: ''; flex: 1; height: 1px; background: #e2e8f0;
    }
    .video-wrapper {
      position: relative; width: 100%; height: 280px;
      background: #0f172a; border-radius: 16px; overflow: hidden;
    }
    .video-wrapper video {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .corner {
      position: absolute; width: 24px; height: 24px;
      border-color: #5b6cf6; border-style: solid; border-width: 0;
    }
    .tl { top: 12px; left: 12px; border-top-width: 3px; border-left-width: 3px; border-radius: 4px 0 0 0; }
    .tr { top: 12px; right: 12px; border-top-width: 3px; border-right-width: 3px; border-radius: 0 4px 0 0; }
    .bl { bottom: 12px; left: 12px; border-bottom-width: 3px; border-left-width: 3px; border-radius: 0 0 0 4px; }
    .br { bottom: 12px; right: 12px; border-bottom-width: 3px; border-right-width: 3px; border-radius: 0 0 4px 0; }
    .scan-line {
      position: absolute; left: 10%; width: 80%; height: 2px;
      background: linear-gradient(90deg, transparent, #5b6cf6, transparent);
      animation: scanMove 2s ease-in-out infinite;
    }
    @keyframes scanMove {
      0% { top: 20%; } 50% { top: 80%; } 100% { top: 20%; }
    }
    .scanner-button {
      width: 100%; border: none;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: white; border-radius: 12px; padding: 14px;
      font-size: 15px; font-weight: 600; cursor: pointer;
    }
    .scanner-button:hover { opacity: 0.88; }
    .status-box {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 18px; border-radius: 12px;
      background: #eef2ff; color: #4338ca;
      font-size: 14px; font-weight: 500;
    }
    .status-box.error { background: #fef2f2; color: #dc2626; }
    .pulse-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: #5b6cf6; animation: pulse 1s infinite; flex-shrink: 0;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }
    .result-box {
      border-radius: 16px; padding: 24px;
      display: flex; flex-direction: column;
      align-items: center; gap: 12px; text-align: center;
    }
    .success-box { background: #f0fdf4; border: 1.5px solid #86efac; }
    .fail-box { background: #fef2f2; border: 1.5px solid #fca5a5; }
    .result-icon { font-size: 36px; }
    .result-text { font-size: 16px; font-weight: 600; color: #0f172a; }
    .reset-btn {
      padding: 8px 20px; border: none; border-radius: 10px;
      background: #f1f5f9; color: #334155;
      font-size: 13px; font-weight: 600; cursor: pointer;
    }
  `]
})
export class ScannerComponent implements OnDestroy {
  @ViewChild('video', { static: true })
  videoRef!: ElementRef<HTMLVideoElement>;

  scanning = false;
  manualCode = '';
  errorMsg: string | null = null;
  attendanceMsg = '';
  attendanceSuccess = false;
  private barcodeDetector: any = null;

  private stream: MediaStream | null = null;
  private scanInterval: any = null;
  private scanCanvas: HTMLCanvasElement = document.createElement('canvas');

  constructor(private zone: NgZone, private http: HttpClient) {}

  submitManual() {
    if (!this.manualCode || this.manualCode.length < 4) return;
    this.markAttendance(this.manualCode);
  }

  toggleScanning() {
    this.scanning ? this.stopScanning() : this.startScanning();
  }

  async startScanning() {
    this.errorMsg = null;
    this.scanning = true;
    const video = this.videoRef.nativeElement;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      video.srcObject = this.stream;
      video.onloadedmetadata = () => {
        video.play().then(() => {
          this.scanInterval = setInterval(() => this.scanFrame(),100);
        });
      };
    } catch (err: any) {
      this.zone.run(() => {
        this.errorMsg = err.name === 'NotAllowedError'
          ? 'Camera access denied.'
          : 'Could not start camera.';
        this.scanning = false;
      });
    }
  }

  async scanFrame() {
  const video = this.videoRef.nativeElement;
  if (video.readyState !== 4 || video.videoWidth === 0) return;

  try {
    // Use BarcodeDetector if available (Chrome/Edge - much better)
    const BarcodeDetectorAPI = (window as any).BarcodeDetector;
    if (BarcodeDetectorAPI) {
      if (!this.barcodeDetector) {
        this.barcodeDetector = new BarcodeDetectorAPI({ formats: ['qr_code'] });
      }
      const barcodes = await this.barcodeDetector.detect(video);
      if (barcodes.length > 0) {
        this.zone.run(() => {
          this.stopScanning();
          this.manualCode = barcodes[0].rawValue;
          this.submitManual();
        });
        return;
      }
    } else {
      // Fallback to jsQR
      const canvas = this.scanCanvas;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let qr = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
      if (!qr) qr = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'onlyInvert' });
      if (qr && qr.data) {
        this.zone.run(() => {
          this.stopScanning();
          this.manualCode = qr!.data;
          this.submitManual();
        });
      }
    }
  } catch (err) {
    console.error('Scan error:', err);
  }
}

  markAttendance(code: string) {
    const user = JSON.parse(localStorage.getItem('xv_user') || '{}');
    if (!user?.id) {
      this.attendanceMsg = 'Not logged in!';
      this.attendanceSuccess = false;
      return;
    }

    this.http.post<any>('http://localhost/Xorvia/backend/attendance.php', {
      user_id: user.id,
      qr_code: code
    }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.attendanceMsg = res.message;
          this.attendanceSuccess = res.success;
          this.manualCode = '';
        });
      },
      error: () => {
        this.zone.run(() => {
          this.attendanceMsg = 'Could not connect to server. Is XAMPP running?';
          this.attendanceSuccess = false;
        });
      }
    });
  }

  reset() {
    this.attendanceMsg = '';
    this.attendanceSuccess = false;
    this.manualCode = '';
    this.errorMsg = null;
  }

  stopScanning() {
    this.scanning = false;
    if (this.scanInterval) { clearInterval(this.scanInterval); this.scanInterval = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    const video = this.videoRef?.nativeElement;
    if (video) { video.pause(); video.srcObject = null; }
  }

  ngOnDestroy() { this.stopScanning(); }
}