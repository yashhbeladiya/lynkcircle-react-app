//@ts-nocheck
import React from 'react';
import Grid from '@mui/material/Grid2';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Typography
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

const ReviewsDialog = ({ 
    open, 
    onClose, 
    service 
  }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Reviews for {service.serviceName}
        </DialogTitle>
        <DialogContent>
          {service.reviews.map((review, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar>{review.reviewer.name[0]}</Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">
                      {review.reviewer.name}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                  </Grid>
                </Grid>
                <Typography variant="body2" mt={1}>
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default ReviewsDialog;