import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Vibrate, Moon, Clock, Trash2, CloudRain, VolumeX, Wind, Music } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Switch } from '@/components/ui/switch';
import { usePreferences } from '@/hooks/usePreferences';
import { cn } from '@/lib/utils';

export function Settings() {
  const navigate = useNavigate();
  const { preferences, updatePreference } = usePreferences();

  const clearAllData = () => {
    if (confirm('This will clear all your check-ins and saved entries. This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-serif text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your experience
        </p>
      </div>

      {/* Settings list */}
      <div className="space-y-6">
        {/* Sound & Vibration */}
        <section className="animate-fade-up delay-100">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Feedback
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Sound</p>
                  <p className="text-sm text-muted-foreground">Audio cues during exercises</p>
                </div>
              </div>
              <Switch
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) => updatePreference('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Vibration</p>
                  <p className="text-sm text-muted-foreground">Haptic feedback</p>
                </div>
              </div>
              <Switch
                checked={preferences.vibrationEnabled}
                onCheckedChange={(checked) => updatePreference('vibrationEnabled', checked)}
              />
            </div>
          </div>
        </section>

        {/* Default Duration */}
        <section className="animate-fade-up delay-200">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Breathing Defaults
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium text-foreground">Default Duration</p>
              </div>
              <div className="flex gap-2">
                {[2, 3, 5].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => updatePreference('preferredDuration', duration)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-center transition-all duration-300",
                      preferences.preferredDuration === duration
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Sound */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium text-foreground">Default Ambient Sound</p>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'silence' as const, label: 'Silence', icon: VolumeX },
                  { id: 'rain' as const, label: 'Rain', icon: CloudRain },
                  { id: 'brown-noise' as const, label: 'Brown', icon: Volume2 },
                  { id: 'wind-chime' as const, label: 'Chime', icon: Wind },
                  { id: 'singing-bowl' as const, label: 'Bowl', icon: Music },
                ].map((sound) => {
                  const Icon = sound.icon;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => updatePreference('ambientSound', sound.id)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-center transition-all duration-300",
                        preferences.ambientSound === sound.id
                          ? "bg-accent/20 text-accent border border-accent/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{sound.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="animate-fade-up delay-300">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Appearance
          </h3>
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Easier on the eyes</p>
              </div>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => updatePreference('darkMode', checked)}
            />
          </div>
        </section>

        {/* Data */}
        <section className="animate-fade-up delay-400">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Data
          </h3>
          
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-left transition-all duration-300 hover:bg-destructive/15"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Clear All Data</p>
                <p className="text-sm text-muted-foreground">Delete all local data</p>
              </div>
            </div>
          </button>
        </section>
      </div>

      {/* About */}
      <div className="mt-10 text-center animate-fade-up delay-400">
        <p className="text-sm text-muted-foreground mb-2">
          Anxiety Ease
        </p>
        <p className="text-xs text-muted-foreground/60">
          Your data stays on your device. No tracking. No ads.
        </p>
      </div>
    </PageContainer>
  );
}

export default Settings;
