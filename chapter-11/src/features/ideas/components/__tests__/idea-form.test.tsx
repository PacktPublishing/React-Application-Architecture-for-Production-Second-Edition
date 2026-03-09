import { vi } from 'vitest';

import { render, screen, userEvent, waitFor } from 'testing/test-utils';

import { IdeaForm, type IdeaFormProps } from '../idea-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common:title': 'Title',
        'common:saving': 'Saving...',
        'common:cancel': 'Cancel',
        'common:selected': 'selected',
        'common:notSelected': 'not selected',
        'ideas:ideaTitlePlaceholder': 'Enter idea title',
        'ideas:shortDescription': 'Short Description',
        'ideas:shortDescriptionPlaceholder': 'Brief summary of your idea',
        'ideas:detailedDescription': 'Detailed Description',
        'ideas:detailedDescriptionPlaceholder': 'Describe your idea in detail',
        'ideas:tags': 'Tags',
        'ideas:loadingTags': 'Loading tags...',
        'ideas:noTagsAvailable': 'No tags available',
        'ideas:createIdea': 'Create Idea',
        'ideas:updateIdea': 'Update Idea',
        'ideas:tagStatus': '{{tag}} ({{status}})',
      };
      return translations[key] || key;
    },
  }),
}));

const mockTagsQuery = vi.fn();

vi.mock('../../api/get-tags', () => ({
  useTagsQuery: () => mockTagsQuery(),
}));

const renderIdeaForm = (props: Partial<IdeaFormProps> = {}) => {
  const defaultProps: IdeaFormProps = {
    onSubmit: vi.fn(),
    isSubmitting: false,
    ...props,
  };

  return {
    ...render(<IdeaForm {...defaultProps} />),
    props: defaultProps,
  };
};

describe('IdeaForm', () => {
  beforeEach(() => {
    mockTagsQuery.mockReturnValue({
      data: { data: ['tech', 'design', 'business'] },
      isLoading: false,
    });
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      renderIdeaForm();

      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Short Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Detailed Description')).toBeInTheDocument();
    });

    it('should render submit button with create text for new idea', () => {
      renderIdeaForm();

      expect(
        screen.getByRole('button', { name: 'Create Idea' }),
      ).toBeInTheDocument();
    });

    it('should render submit button with update text when initialData provided', () => {
      renderIdeaForm({
        initialData: {
          id: '1',
          title: 'Test Idea',
          shortDescription: 'Short desc',
          description: 'Long desc',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: 'user-1',
          author: {
            id: 'user-1',
            username: 'testuser',
            email: 'test@example.com',
          },
          reviewsCount: 0,
          avgRating: null,
        },
      });

      expect(
        screen.getByRole('button', { name: 'Update Idea' }),
      ).toBeInTheDocument();
    });

    it('should render submit button with saving text when isSubmitting', () => {
      renderIdeaForm({ isSubmitting: true });

      expect(
        screen.getByRole('button', { name: 'Saving...' }),
      ).toBeInTheDocument();
    });

    it('should disable submit button when isSubmitting', () => {
      renderIdeaForm({ isSubmitting: true });

      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('should render cancel button when onCancel provided', () => {
      renderIdeaForm({ onCancel: vi.fn() });

      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
    });

    it('should not render cancel button when onCancel not provided', () => {
      renderIdeaForm();

      expect(screen.queryByLabelText('Cancel')).not.toBeInTheDocument();
    });
  });

  describe('tags', () => {
    it('should render available tags', () => {
      renderIdeaForm();

      expect(screen.getByText('tech')).toBeInTheDocument();
      expect(screen.getByText('design')).toBeInTheDocument();
      expect(screen.getByText('business')).toBeInTheDocument();
    });

    it('should show loading message when tags are loading', () => {
      mockTagsQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });

      renderIdeaForm();

      expect(screen.getByText('Loading tags...')).toBeInTheDocument();
    });

    it('should show no tags message when no tags available', () => {
      mockTagsQuery.mockReturnValue({
        data: { data: [] },
        isLoading: false,
      });

      renderIdeaForm();

      expect(screen.getByText('No tags available')).toBeInTheDocument();
    });

    it('should toggle tag selection when clicked', async () => {
      const user = userEvent.setup();
      renderIdeaForm();

      const techTag = screen.getByText('tech').closest('button')!;
      expect(techTag).toHaveAttribute('aria-pressed', 'false');

      await user.click(techTag);
      expect(techTag).toHaveAttribute('aria-pressed', 'true');

      await user.click(techTag);
      expect(techTag).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('initial data', () => {
    it('should populate form with initial data', () => {
      renderIdeaForm({
        initialData: {
          id: '1',
          title: 'My Idea',
          shortDescription: 'Short description',
          description: 'Full description',
          tags: ['tech'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: 'user-1',
          author: {
            id: 'user-1',
            username: 'testuser',
            email: 'test@example.com',
          },
          reviewsCount: 0,
          avgRating: null,
        },
      });

      expect(screen.getByLabelText('Title')).toHaveValue('My Idea');
      expect(screen.getByLabelText('Short Description')).toHaveValue(
        'Short description',
      );
      expect(screen.getByLabelText('Detailed Description')).toHaveValue(
        'Full description',
      );
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with form data when submitted with valid data', async () => {
      const user = userEvent.setup();
      const { props } = renderIdeaForm();

      await user.type(screen.getByLabelText('Title'), 'New Idea Title');
      await user.type(
        screen.getByLabelText('Short Description'),
        'A brief summary',
      );
      await user.type(
        screen.getByLabelText('Detailed Description'),
        'Detailed description of the idea',
      );
      await user.click(screen.getByRole('button', { name: 'Create Idea' }));

      await waitFor(() => {
        expect(props.onSubmit).toHaveBeenCalledWith(
          {
            title: 'New Idea Title',
            shortDescription: 'A brief summary',
            description: 'Detailed description of the idea',
            tags: [],
          },
          expect.anything(),
        );
      });
    });

    it('should include selected tags in submission', async () => {
      const user = userEvent.setup();
      const { props } = renderIdeaForm();

      await user.type(screen.getByLabelText('Title'), 'New Idea');
      await user.type(screen.getByLabelText('Short Description'), 'Short desc');
      await user.type(
        screen.getByLabelText('Detailed Description'),
        'Full description',
      );

      await user.click(screen.getByText('tech').closest('button')!);
      await user.click(screen.getByText('design').closest('button')!);
      await user.click(screen.getByRole('button', { name: 'Create Idea' }));

      await waitFor(() => {
        expect(props.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['tech', 'design'],
          }),
          expect.anything(),
        );
      });
    });

    it('should not call onSubmit when submitted with empty fields', async () => {
      const user = userEvent.setup();
      const { props } = renderIdeaForm();

      await user.click(screen.getByRole('button', { name: 'Create Idea' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not call onSubmit with empty title', async () => {
      const user = userEvent.setup();
      const { props } = renderIdeaForm();

      await user.type(screen.getByLabelText('Short Description'), 'Short desc');
      await user.type(
        screen.getByLabelText('Detailed Description'),
        'Full description',
      );
      await user.click(screen.getByRole('button', { name: 'Create Idea' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('cancel button', () => {
    it('should call onCancel when cancel button clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      renderIdeaForm({ onCancel });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalled();
    });

    it('should disable cancel button when isSubmitting', () => {
      renderIdeaForm({ onCancel: vi.fn(), isSubmitting: true });

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });
  });
});
