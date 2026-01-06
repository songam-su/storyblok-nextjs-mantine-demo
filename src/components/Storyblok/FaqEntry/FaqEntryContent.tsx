import { Stack, Text } from '@mantine/core';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import styles from './FaqEntry.module.scss';

interface FaqEntryContentProps {
  question?: string;
  answer?: StoryblokRichtext;
  showQuestion?: boolean;
}

export const FaqEntryContent: React.FC<FaqEntryContentProps> = ({ question, answer, showQuestion = true }) => {
  if (!question && !answer) {
    return null;
  }

  return (
    <Stack gap="sm">
      {showQuestion && question && (
        <Text component="h3" className={styles.question}>
          {question}
        </Text>
      )}
      {answer && <div className={styles.answer}>{renderSbRichText(answer)}</div>}
    </Stack>
  );
};
