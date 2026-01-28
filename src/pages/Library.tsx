import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Brain, Moon, Heart, MessageCircle } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'understanding',
    icon: Brain,
    title: 'Understanding Anxiety',
    description: 'Learn what anxiety is and why it happens',
    articles: [
      {
        title: 'What is Anxiety?',
        content: `Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. Everyone experiences anxiety at times – it's a normal part of being human.

When you feel anxious, your body activates its "fight or flight" response. This is an ancient survival mechanism that helped our ancestors respond to danger.

Physical symptoms can include:
• Rapid heartbeat
• Shallow breathing
• Muscle tension
• Sweating
• Upset stomach

These sensations, while uncomfortable, are not dangerous. They're simply your body preparing to protect you.`
      },
      {
        title: 'Why Do I Feel This Way?',
        content: `Anxiety can be triggered by many things – stress, uncertainty, past experiences, or sometimes nothing specific at all. 

Some common triggers include:
• Major life changes
• Work or school pressure
• Health concerns
• Relationship challenges
• Financial worries

Remember: Having anxiety doesn't mean something is wrong with you. It means your nervous system is doing its job, even if it's being a bit overprotective.`
      }
    ]
  },
  {
    id: 'panic',
    icon: Heart,
    title: 'Panic Support',
    description: 'Understanding and managing panic',
    articles: [
      {
        title: 'Understanding Panic',
        content: `A panic attack is an intense wave of fear that comes on suddenly. While terrifying, panic attacks are not dangerous – they're your body's alarm system misfiring.

During a panic attack, you might experience:
• Racing heart
• Difficulty breathing
• Chest tightness
• Dizziness
• Feeling detached from reality

The most important thing to know: Panic attacks always end. They typically peak within 10 minutes and rarely last more than 30 minutes.

Remind yourself: "This is uncomfortable, but I am safe. This will pass."`
      },
      {
        title: 'Grounding Techniques',
        content: `When panic rises, grounding techniques can help anchor you to the present moment.

The 5-4-3-2-1 method:
• Name 5 things you can see
• Name 4 things you can touch
• Name 3 things you can hear
• Name 2 things you can smell
• Name 1 thing you can taste

Other quick grounding techniques:
• Hold something cold (ice cube, cold water)
• Focus on your feet on the floor
• Name objects around you by color
• Slowly count backwards from 10

These techniques work by engaging your senses and redirecting your focus away from anxious thoughts.`
      }
    ]
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Sleep & Night Anxiety',
    description: 'Finding calm when sleep feels far away',
    articles: [
      {
        title: 'Why Anxiety Worsens at Night',
        content: `Many people find anxiety peaks at night. Without the distractions of the day, worried thoughts can feel louder.

At night, your mind has space to process the day and anticipate tomorrow. This processing is normal, but can feel overwhelming.

Some helpful approaches:
• Keep a "worry notepad" by your bed – write concerns down to address tomorrow
• Create a calming pre-sleep ritual
• Avoid screens 30+ minutes before bed
• Keep your room cool and dark

Remember: Not sleeping one night won't hurt you. The pressure to sleep often makes it harder. Let go of the expectation and focus on rest instead.`
      },
      {
        title: 'Nighttime Breathing',
        content: `Slow, deep breathing activates your parasympathetic nervous system – your body's "rest and digest" mode.

A simple technique for sleep:
1. Breathe in slowly for 4 counts
2. Hold gently for 4 counts
3. Exhale slowly for 6-8 counts
4. Repeat for several minutes

The extended exhale is key – it signals safety to your body.

Other calming practices:
• Progressive muscle relaxation (tense and release each muscle group)
• Body scan meditation (notice each part of your body without judgment)
• Visualize a peaceful place in detail`
      }
    ]
  },
  {
    id: 'selftalk',
    icon: MessageCircle,
    title: 'Gentle Self-Talk',
    description: 'Words that help during difficult moments',
    articles: [
      {
        title: 'Phrases That Help',
        content: `The words we say to ourselves matter. During anxious moments, try these gentle reminders:

Grounding phrases:
• "I am safe right now"
• "This feeling will pass"
• "I've handled difficult things before"
• "My anxiety is trying to protect me"

Self-compassion phrases:
• "It's okay to feel this way"
• "I'm doing the best I can"
• "This is hard, and I'm still here"
• "I don't have to be perfect"

Perspective phrases:
• "What would I say to a friend feeling this?"
• "Will this matter in a week? A year?"
• "I can handle this one moment at a time"`
      },
      {
        title: 'Being Kind to Yourself',
        content: `Anxiety often comes with self-criticism. We judge ourselves for feeling anxious, which creates more anxiety.

Self-compassion means:
• Treating yourself as you would a good friend
• Acknowledging that suffering is part of being human
• Not ignoring your pain, but not exaggerating it either

Practice self-compassion:
• Notice when you're being hard on yourself
• Pause and ask: "How would I comfort a friend?"
• Speak to yourself with the same kindness

Remember: You didn't choose to feel anxious. Having anxiety says nothing about your strength or worth as a person. Being gentle with yourself is not weakness – it's wisdom.`
      }
    ]
  }
];

export function Library() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const category = categories.find(c => c.id === selectedCategory);
  const article = category?.articles[selectedArticle ?? -1];

  // Reading an article
  if (category && article) {
    return (
      <PageContainer>
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-serif text-foreground mb-6 animate-fade-up">
          {article.title}
        </h1>

        <div className="prose prose-invert max-w-none animate-fade-up delay-100">
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-calm mb-4 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </PageContainer>
    );
  }

  // Viewing a category
  if (category) {
    const Icon = category.icon;
    
    return (
      <PageContainer>
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Library</span>
        </button>

        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <div className="p-4 rounded-2xl bg-primary/15">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-foreground">
              {category.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {category.articles.length} articles
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {category.articles.map((article, index) => (
            <button
              key={index}
              onClick={() => setSelectedArticle(index)}
              className={cn(
                "w-full p-5 rounded-2xl bg-secondary/50 border border-border/50",
                "text-left transition-all duration-300 active:scale-[0.98]",
                "hover:bg-secondary animate-fade-up"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">{article.title}</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </PageContainer>
    );
  }

  // Main library view
  return (
    <PageContainer>
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-serif text-foreground mb-2">
          Safe Space Library
        </h1>
        <p className="text-muted-foreground">
          Gentle guidance when you need it
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "w-full p-5 rounded-2xl bg-secondary/50 border border-border/50",
                "text-left transition-all duration-300 active:scale-[0.98]",
                "hover:bg-secondary animate-fade-up"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/15">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}

export default Library;
