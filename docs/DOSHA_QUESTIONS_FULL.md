# Complete Dosha Assessment Questions (16 Questions)

**Purpose:** Full comprehensive Prakriti assessment based on AYUSH/CCRAS guidelines
**Status:** Saved for future use - Currently using 10-question version in app

---

## All 16 Questions

### PHYSICAL TRAITS (6 questions)

```javascript
{
  id: 'body_frame',
  question: 'What best describes your body frame?',
  options: [
    { text: 'Thin, light build; hard to gain weight; prominent joints', dosha: 'vata', points: 2 },
    { text: 'Medium, athletic build; can gain/lose weight easily', dosha: 'pitta', points: 2 },
    { text: 'Larger, solid build; gains weight easily, hard to lose', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'skin_type',
  question: 'How would you describe your skin?',
  options: [
    { text: 'Dry, rough, or thin; prone to cracking; cool to touch', dosha: 'vata', points: 2 },
    { text: 'Warm, soft; prone to redness, acne, rashes, or sunburn', dosha: 'pitta', points: 2 },
    { text: 'Smooth, moist, soft; rarely breaks out; naturally glowing', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'hair_type',
  question: 'What best describes your hair?',
  options: [
    { text: 'Dry, frizzy, thin, prone to split ends or dandruff', dosha: 'vata', points: 2 },
    { text: 'Fine, straight, prone to early graying or thinning', dosha: 'pitta', points: 2 },
    { text: 'Thick, wavy or curly, lustrous, slightly oily', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'eyes',
  question: 'How would you describe your eyes?',
  options: [
    { text: 'Small, dry, may twitch or blink frequently', dosha: 'vata', points: 2 },
    { text: 'Medium, sharp gaze, may get red or irritated easily', dosha: 'pitta', points: 2 },
    { text: 'Large, calm, moist, with thick lashes', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'body_temp',
  question: 'How do you experience body temperature?',
  options: [
    { text: 'Often feel cold; hands and feet are usually cold', dosha: 'vata', points: 2 },
    { text: 'Usually feel warm; sweat easily; dislike heat', dosha: 'pitta', points: 2 },
    { text: 'Comfortable in most temperatures; feel cool to touch', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'joints',
  question: 'How are your joints?',
  options: [
    { text: 'Prominent, crack/pop easily, may feel stiff', dosha: 'vata', points: 2 },
    { text: 'Medium, flexible, may get inflamed under stress', dosha: 'pitta', points: 2 },
    { text: 'Large, well-padded, stable, rarely have issues', dosha: 'kapha', points: 2 }
  ]
},
```

### PHYSIOLOGICAL TRAITS (6 questions)

```javascript
{
  id: 'appetite',
  question: 'How is your appetite?',
  options: [
    { text: 'Irregular; sometimes hungry, sometimes not; forget to eat', dosha: 'vata', points: 2 },
    { text: 'Strong; get irritable or "hangry" if meals are delayed', dosha: 'pitta', points: 2 },
    { text: 'Steady but moderate; can skip meals without discomfort', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'digestion',
  question: 'How is your digestion?',
  options: [
    { text: 'Variable; prone to gas, bloating, or constipation', dosha: 'vata', points: 2 },
    { text: 'Strong; may experience acid reflux or loose stools', dosha: 'pitta', points: 2 },
    { text: 'Slow but steady; feel heavy after meals', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'sleep',
  question: 'How is your sleep pattern?',
  options: [
    { text: 'Light, interrupted; difficulty falling asleep; wake easily', dosha: 'vata', points: 2 },
    { text: 'Moderate; sleep well but may wake up hot', dosha: 'pitta', points: 2 },
    { text: 'Deep, long; hard to wake up; love sleeping', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'energy',
  question: 'How would you describe your energy levels?',
  options: [
    { text: 'Comes in bursts; fluctuates throughout the day; tire easily', dosha: 'vata', points: 2 },
    { text: 'Strong, focused; can push hard but may burn out', dosha: 'pitta', points: 2 },
    { text: 'Steady but slow to start; good stamina once going', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'thirst',
  question: 'How is your thirst?',
  options: [
    { text: 'Variable; often forget to drink water', dosha: 'vata', points: 2 },
    { text: 'Strong; frequently thirsty; prefer cold drinks', dosha: 'pitta', points: 2 },
    { text: 'Low; rarely feel very thirsty', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'sweat',
  question: 'How much do you sweat?',
  options: [
    { text: 'Minimal; skin tends to stay dry', dosha: 'vata', points: 2 },
    { text: 'Profuse; sweat easily even with little exertion', dosha: 'pitta', points: 2 },
    { text: 'Moderate; sweat is cool and not strong-smelling', dosha: 'kapha', points: 2 }
  ]
},
```

### PSYCHOLOGICAL TRAITS (4 questions)

```javascript
{
  id: 'mind',
  question: 'How would you describe your mind?',
  options: [
    { text: 'Active, restless; many thoughts; creative but scattered', dosha: 'vata', points: 2 },
    { text: 'Sharp, focused; analytical; can be critical', dosha: 'pitta', points: 2 },
    { text: 'Calm, steady; think before acting; can be slow to decide', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'stress_response',
  question: 'How do you typically respond to stress?',
  options: [
    { text: 'Anxious, worried, fearful; may have trouble sleeping', dosha: 'vata', points: 2 },
    { text: 'Irritable, frustrated, angry; may lash out', dosha: 'pitta', points: 2 },
    { text: 'Withdrawn, avoidant; may feel sad or unmotivated', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'learning',
  question: 'How do you learn new things?',
  options: [
    { text: 'Quick to learn, quick to forget; need to review often', dosha: 'vata', points: 2 },
    { text: 'Focused learner; good memory; like to master subjects', dosha: 'pitta', points: 2 },
    { text: 'Slow to learn but excellent long-term retention', dosha: 'kapha', points: 2 }
  ]
},
{
  id: 'speech',
  question: 'How would you describe your speech?',
  options: [
    { text: 'Fast, talkative; may jump between topics', dosha: 'vata', points: 2 },
    { text: 'Clear, precise, convincing; can be sharp or cutting', dosha: 'pitta', points: 2 },
    { text: 'Slow, melodious, thoughtful; choose words carefully', dosha: 'kapha', points: 2 }
  ]
},
```

---

## Research Sources

- [Prakriti200 Dataset (arXiv)](https://arxiv.org/html/2510.06262) - 24 questions based on AYUSH/CCRAS guidelines
- [Frontiers Medicine Review](https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2025.1656249/full) - Critical review of Prakriti assessment tools
- [Banyan Botanicals](https://www.banyanbotanicals.com/pages/dosha-quiz) - Clinically tested dosha quiz
- [Prokerala Prakriti Test](https://www.prokerala.com/health/ayurveda/prakriti-analysis/prakriti-test.php) - 40 questions across 4 sections

---

## To Restore Full 16 Questions

Copy the full questions array from this document to `src/data/symptoms.ts`, replacing the `doshaQuestions` export.
