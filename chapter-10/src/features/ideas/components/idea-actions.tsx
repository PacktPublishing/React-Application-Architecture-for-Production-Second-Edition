import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Idea } from '@/types/generated/types.gen';

import { DeleteIdea } from './delete-idea';

export type IdeaActionsProps = {
  idea: Idea;
};

export function IdeaActions({ idea }: IdeaActionsProps) {
  const { t } = useTranslation(['ideas']);
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditClick = () => {
    navigate(`/dashboard/ideas/${idea.id}/edit`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label={t('ideas:ideaActionsMenu')}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('ideas:editIdea')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('ideas:deleteIdea')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteIdea
        idea={idea}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
